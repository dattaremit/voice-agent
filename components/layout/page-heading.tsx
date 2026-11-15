type PageHeadingProps = {
  title: string;
  description: string;
};

export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <div className="space-y-1">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
