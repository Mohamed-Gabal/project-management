import React from "react";
import Link from "next/link";
import ArrowIcon from "@/assets/icons/arrow-right.svg";
import Image from "next/image";

type BreadCrumbItem = {
  label: string;
  href?: string;
};

interface BreadCrumbProps {
  items: BreadCrumbItem[];
}

const BreadCrumb = ({ items }: BreadCrumbProps) => {
  {
    /* Breadcrumb - hidden on mobile */
  }
  return (
    <section className="hidden md:block">
      <div className="flex items-center gap-2 text-label-sm font-bold tracking-label-sm uppercase">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`${isLast ? "text-primary" : "text-neutral"}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-primary" : "text-neutral"}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <Image
                  src={ArrowIcon}
                  alt=""
                  width={10}
                  height={10}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
export default BreadCrumb;
