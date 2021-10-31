import { rgbToHex } from '../utils';
import { set, get } from 'idb-keyval';

export const saveColor = async (colorValues: {
  color: Array<number>;
  bitmap: ImageBitmap;
}) => {
  const color = rgbToHex(
    colorValues.color[0],
    colorValues.color[1],
    colorValues.color[2]
  );
  console.log(color);

  const colors = (await get('colors')) || [];
  if (colors && colors.length > 0) {
    colors.push({ color, bitmap: colorValues.bitmap });
    await set('colors', colors);
  } else {
    await set('colors', [{ color, bitmap: colorValues.bitmap }]);
  }
};

export const deleteColor = async (color: string) => {
  const colors = (await get('colors')) || [];
  if (colors && colors.length > 0) {
    const newColors = colors.filter((c: any) => c.color !== color);
    await set('colors', newColors);
  }
}

export const getColors = async () => {
  const colors = (await get('colors')) || [];
  return colors;
};
