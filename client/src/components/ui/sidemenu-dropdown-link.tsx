import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";
import SidemenuLink from "./sidemenu-link";
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "./button";

interface SidemenuDropdownLinkProps {
  label: string;
  base: string;
  childrens?: {
    href: string;
    label: string;
    icon?: LucideIcon;
    subchildrens: {
      href: string;
      label: string;
      icon?: LucideIcon;
    }[];
  }[];
  Icon: LucideIcon;
}

export function SidemenuDropdownLink({
  label,
  childrens,
  Icon,
  base,
}: SidemenuDropdownLinkProps) {
  const location = useLocation();

  return childrens ? (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-darkblue rounded-md"
      defaultValue={location.pathname.includes(base) ? base : ""}
    >
      <AccordionItem value={base}>
        <AccordionTrigger
          className={
            location.pathname.includes(base) ? "bg-light" : "active:bg-light"
          }
        >
          <div className="flex gap-2 items-center">
            <Icon className="!rotate-0" size={18} />
            {label}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {childrens?.map((children) =>
            children.subchildrens ? (
              <Accordion
                key={children.href}
                type="single"
                collapsible
                defaultValue={
                  location.pathname.includes(children.href) ? children.href : ""
                }
              >
                <AccordionItem value={children.href}>
                  <AccordionTrigger
                    className={
                      location.pathname.includes(children.href)
                        ? "bg-transparent font-bold"
                        : "bg-transparent"
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {children.icon && <children.icon size={18} />}
                      {children.label}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {children.subchildrens?.map((subchildren) => (
                      <SidemenuLink
                        key={subchildren.href}
                        href={`/${base}${children.href}${subchildren.href}`}
                        Icon={subchildren.icon}
                        label={subchildren.label}
                        className="px-4 py-2"
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <SidemenuLink
                href={"/" + base + "" + children.href}
                Icon={children.icon}
                label={children.label}
              />
            )
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    <a href={base}>
      <Button
        className={`hover:bg-dark/40 bg-transparent shadow-none justify-start gap-2 w-full ${
          location.pathname === base || location.pathname.startsWith(base + "/")
            ? "font-bold bg-dark hover:bg-dark"
            : ""
        }`}
      >
        {Icon && <Icon size={18} />}
        {label}
      </Button>
    </a>
  );
}
