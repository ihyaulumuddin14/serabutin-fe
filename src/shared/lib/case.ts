/* eslint-disable @typescript-eslint/no-explicit-any */
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export const toCamel = (data: unknown) =>
  camelcaseKeys(data as any, { deep: true });

export const toSnake = (data: unknown) =>
  snakecaseKeys(data as any, { deep: true });