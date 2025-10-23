import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode;
  readonly hasPadding?: boolean;
  readonly hasShadow?: boolean;
}

export const Card = ({
  children,
  hasPadding = true,
  hasShadow = true,
  className = "",
  ...props
}: CardProps) => {
  if (!children) {
    return null;
  }

  return (
    <div
      className={`
        bg-white rounded-lg border-2 border-neutral-900
        ${hasPadding ? "p-6" : ""}
        ${hasShadow ? "shadow-vintage-sm hover:shadow-vintage-lg transition-all duration-200" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode;
}

export const CardHeader = ({
  children,
  className = "",
  ...props
}: CardHeaderProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className={`pb-4 border-b border-neutral-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  readonly children: React.ReactNode;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = ({
  children,
  level = 3,
  className = "",
  ...props
}: CardTitleProps) => {
  if (!children) {
    return null;
  }

  const headingClass = `text-lg font-semibold text-neutral-900 ${className}`;

  switch (level) {
    case 1:
      return (
        <h1 className={headingClass} {...props}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={headingClass} {...props}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className={headingClass} {...props}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 className={headingClass} {...props}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 className={headingClass} {...props}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 className={headingClass} {...props}>
          {children}
        </h6>
      );
    default:
      return (
        <h3 className={headingClass} {...props}>
          {children}
        </h3>
      );
  }
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode;
}

export const CardContent = ({
  children,
  className = "",
  ...props
}: CardContentProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className={`pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode;
}

export const CardFooter = ({
  children,
  className = "",
  ...props
}: CardFooterProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className={`pt-4 border-t border-neutral-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
