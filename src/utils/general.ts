export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const endpointUrl = (url: string | undefined) => {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}`;
};
