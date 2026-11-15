const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export const formatDate = (value: string | Date) => dateFormatter.format(new Date(value));

export const formatDateTime = (value: Date) => dateTimeFormatter.format(value);

export const humanizeKey = (key: string) => {
  const words = key.replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};
