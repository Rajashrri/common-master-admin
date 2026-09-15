import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { getWebsiteSettingApi } from "../api/profileApi";
// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  resource?: string;

  subItems?: {
    name: string;
    path: string;
    resource?: string;
    operation?: "view" | "add" | "edit" | "delete";
    pro?: boolean;
    new?: boolean;
  }[];
};
const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    // subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    name: "Product",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Product Category",
        path: "/product-catogery",
        resource: "productcategory",
        operation: "view",

        pro: false,
      },
      {
        name: "List Product SubCategory",
        path: "/product-subcatogery",
        resource: "productsubcategory",
        operation: "view",
        pro: false,
      },

      {
        name: "Add Product",
        path: "/add-product",
        resource: "product",
        operation: "add",

        pro: false,
      },
      {
        name: "List Product",
        path: "/list-product",
        resource: "product",
        operation: "view",

        pro: false,
      },
    ],
  },

  {
    name: "Project",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Project Category",
        path: "/project-catogery",

        resource: "projectcategory",
        operation: "view",

        pro: false,
      },

      {
        name: "Add Project",
        path: "/add-project",
        resource: "project",
        operation: "add",
        pro: false,
      },
      {
        name: "List Project",
        path: "/list-project",
        resource: "project",
        operation: "view",
        pro: false,
      },
    ],
  },
  {
    name: "Blog",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Blog Category",
        path: "/blog-catogery",

        resource: "blogcategory",
        operation: "view",

        pro: false,
      },
      {
        name: "Add Blog",
        path: "/add-blog",

        resource: "blog",
        operation: "add",

        pro: false,
      },
      {
        name: "List Blog",
        path: "/blog",
        resource: "blog",
        operation: "view",

        pro: false,
      },
    ],
  },

  {
    name: "Service",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Service Category",
        path: "/service-category",

        resource: "servicecategory",
        operation: "view",

        pro: false,
      },
      {
        name: "Add Service",
        path: "/add-service",
        resource: "service",
        operation: "add",

        pro: false,
      },
      {
        name: "List Service",
        path: "/list-service",
        resource: "service",
        operation: "view",

        pro: false,
      },
    ],
  },

  {
    name: "Faq",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Faq Category",
        path: "/faq-category",
        resource: "faqcategory",
        operation: "view",
        pro: false,
      },
      {
        name: "Add Faq",
        path: "/add-faq",

        resource: "faq",
        operation: "add",
        pro: false,
      },
      {
        name: "List Faq",
        path: "/list-faq",
        resource: "faq",
        operation: "view",
        pro: false,
      },
    ],
  },

  {
    name: "News",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List News Category",
        path: "/news-category",
        resource: "newscategory",
        operation: "view",
        pro: false,
      },
      {
        name: "Add News",
        path: "/add-news",
        resource: "news",
        operation: "add",
        pro: false,
      },
      {
        name: "List News",
        path: "/list-news",
        resource: "news",
        operation: "view",
        pro: false,
      },
    ],
  },
  {
    name: "Job",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Job Category",
        path: "/job-category",
        resource: "jobcategory",
        operation: "view",
        pro: false,
      },
      {
        name: "Add Job",
        path: "/add-job",
        resource: "job",
        operation: "add",
        pro: false,
      },
      {
        name: "List Job",
        path: "/list-job",
        resource: "job",
        operation: "view",
        pro: false,
      },
    ],
  },
  {
    name: "Event",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Event Category",
        path: "/event-category",
        resource: "eventcategory",
        operation: "view",
        pro: false,
      },
      {
        name: "Add Event",
        path: "/add-event",
        resource: "event",
        operation: "add",
        pro: false,
      },
      {
        name: "List Event",
        path: "/list-event",
        resource: "event",
        operation: "view",
        pro: false,
      },
    ],
  },

  {
    name: "Gallery",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Gallery Category",
        path: "/gallery-category",
        resource: "gallerycategory",
        operation: "view",
        pro: false,
      },
      {
        name: "Add Gallery",
        path: "/add-gallery",
        resource: "gallery",
        operation: "add",
        pro: false,
      },
      {
        name: "List Gallery",
        path: "/list-gallery",
        resource: "gallery",
        operation: "view",
        pro: false,
      },
    ],
  },

  {
    name: "Video",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Video Category",
        path: "/video-category",
        resource: "videocategory",
        operation: "view",
        pro: false,
      },
      {
        name: "Add Video",
        path: "/add-video",
        resource: "video",
        operation: "add",
        pro: false,
      },
      {
        name: "List Video",
        path: "/list-video",
        resource: "video",
        operation: "view",
        pro: false,
      },
    ],
  },
  {
    name: "Testimonial",
    icon: <TableIcon />,
    subItems: [
      {
        name: "Add Testimonial",
        path: "/add-testimonial",
        resource: "testimonial",
        operation: "add",
        pro: false,
      },
      {
        name: "List Testimonial",
        path: "/list-Testimonial",
        resource: "testimonial",
        operation: "view",
        pro: false,
      },
    ],
  },

  {
    name: "Clientele",
    icon: <TableIcon />,
    subItems: [
      {
        name: "Add Clientele",
        path: "/add-clientele",
        resource: "clientele",
        operation: "add",
        pro: false,
      },
      {
        name: "List Clientele",
        path: "/list-clientele",
        resource: "clientele",
        operation: "view",
        pro: false,
      },
    ],
  },

  {
    name: "Team",
    icon: <TableIcon />,
    subItems: [
      {
        name: "Add Team",
        path: "/add-team",
        resource: "team",
        operation: "add",
        pro: false,
      },
      {
        name: "List Team",
        path: "/list-team",
        resource: "team",
        operation: "view",
        pro: false,
      },
    ],
  },
  {
    name: "Link",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List Link",

        resource: "links",
        operation: "view",
        path: "/list-link",

        pro: false,
      },
    ],
  },
  {
    name: "PDF",
    icon: <TableIcon />,
    subItems: [
      {
        name: "List PDF",
        resource: "pdf",
        operation: "view",
        path: "/list-pdf",

        pro: false,
      },
    ],
  },
  {
    name: "List",
    icon: <TableIcon />,
    subItems: [
      { name: "Contact List", path: "/contact-list", pro: false },
      { name: "Career List", path: "/career-list", pro: false },
      { name: "Newsletter List", path: "/newsletter-list", pro: false },
    ],
  },

  {
    name: "SubAdmin",
    icon: <TableIcon />,
    subItems: [
      { name: " Rolemaster List", path: "/rolemaster-list", pro: false },
      { name: "Add User", path: "/add-user", pro: false },
      { name: "User List", path: "/list-user", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const isAdmin = user.roleName?.toLowerCase() === "admin";

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => {
      const currentPath = location.pathname;

      switch (path) {
        //product

        case "/list-product":
          return (
            currentPath === "/list-product" ||
            currentPath.startsWith("/edit-product") ||
            currentPath.startsWith("/product/seo/")
          );
        case "/list-project":
          return (
            currentPath === "/list-project" ||
            currentPath.startsWith("/edit-project") ||
            currentPath.startsWith("/project-seo/")
          );
        case "/list-video":
          return (
            currentPath === "/list-video" ||
            currentPath.startsWith("/edit-video") ||
            currentPath.startsWith("/video-seo/")
          );
        case "/list-gallery":
          return (
            currentPath === "/list-gallery" ||
            currentPath.startsWith("/edit-gallery")
          );
        // Blog
        case "/blog":
          return (
            currentPath === "/blog" ||
            currentPath.startsWith("/edit-blog") ||
            currentPath.startsWith("/seo/")
          );

        case "/blog-catogery":
          return (
            currentPath === "/blog-catogery" ||
            currentPath.startsWith("/edit-category")
          );
        //service

        case "/list-service":
          return (
            currentPath === "/list-service" ||
            currentPath.startsWith("/edit-service") ||
            currentPath.startsWith("/service/seo/")
          );

        //news

        case "/list-news":
          return (
            currentPath === "/list-news" ||
            currentPath.startsWith("/edit-news") ||
            currentPath.startsWith("/news-seo/")
          );

        //event

        case "/list-event":
          return (
            currentPath === "/list-event" ||
            currentPath.startsWith("/edit-event") ||
            currentPath.startsWith("/event-seo/")
          );

        case "/list-job":
          return (
            currentPath === "/list-job" ||
            currentPath.startsWith("/edit-job") ||
            currentPath.startsWith("/job-seo/")
          );
        case "/list-faq":
          return (
            currentPath === "/list-faq" || currentPath.startsWith("/edit-faq")
          );
        case "/list-user":
          return (
            currentPath === "/list-user" || currentPath.startsWith("/edit-user")
          );
        case "/rolemaster-list":
          return (
            currentPath === "/rolemaster-list" ||
            currentPath.startsWith("/set-privileges")
          );
        // Testimonial
        case "/list-Testimonial":
          return (
            currentPath.startsWith("/list-Testimonial") ||
            currentPath.startsWith("/edit-testimonial")
          );

        // Clientele
        case "/list-clientele":
          return (
            currentPath.startsWith("/list-clientele") ||
            currentPath.startsWith("/edit-clientele")
          );

        // Core Team
        case "/list-team":
          return (
            currentPath.startsWith("/list-team") ||
            currentPath.startsWith("/edit-team")
          );

        default:
          return currentPath === path;
      }
    },
    [location.pathname],
  );
  useEffect(() => {
    loadWebsiteSetting();
  }, []);

  const loadWebsiteSetting = async () => {
    try {
      const res = await getWebsiteSettingApi();

      setPreview({
        logo: res.data?.logo || "",
        favicon: res.data?.favicon || "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [preview, setPreview] = useState({
    logo: "",
    favicon: "",
  });

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const hasPermission = (
    resource?: string,
    operation: "view" | "add" | "edit" | "delete" = "view",
  ) => {
    if (isAdmin) return true;

    if (!resource) return true;

    const permission = permissions.find((p: any) => p.resource === resource);
    console.log("Matched:", permission);
    console.log("permissions", permissions);
    return permission?.operations?.[operation] === true;
  };

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    const filteredItems = isAdmin
      ? items
      : items
          .map((item) => {
            if (item.name === "SubAdmin") {
              return null;
            }

            if (!item.subItems) return item;

            const subItems = item.subItems.filter((sub) => {
              if (!sub.resource) return true;

              return hasPermission(sub.resource, sub.operation || "view");
            });

            return {
              ...item,
              subItems,
            };
          })
          .filter(
            (item) => item && (!item.subItems || item.subItems.length > 0),
          );
    return (
      <ul className="flex flex-col gap-4">
        {filteredItems.map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}

                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`menu-dropdown-badge ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              }`}
                            >
                              new
                            </span>
                          )}

                          {subItem.pro && (
                            <span
                              className={`menu-dropdown-badge ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              }`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src={preview.logo}
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
