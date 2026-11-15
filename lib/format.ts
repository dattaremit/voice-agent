const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export const formatDate = (value: string | Date) => dateFormatter.format(new Date(value));
