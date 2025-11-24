import NavLink from "./NavLink";

const DesktopNavigation = ({ activeLink, handleNavigation, isTransparent, textColor, hoverTextColor }: any) => (
    <nav className="desktop-navigation LinksDesktop flex-1 h-full flex justify-center">
        <ul className="desktop-nav-list flex h-full items-center gap-8">
            <li className="nav-item-home h-full">
                <NavLink
                    href="/"
                    onClick={() => handleNavigation("home")}
                    linkId="home"
                    activeLink={activeLink}
                    isTransparent={isTransparent}
                    textColor={textColor}
                    hoverTextColor={hoverTextColor}
                >
                    Page d&apos;accueil
                </NavLink>
            </li>
            <li className="nav-item-shop">
                <NavLink
                    href="/Collections?page=1"
                    onClick={() => handleNavigation("shop")}
                    linkId="shop"
                    activeLink={activeLink}
                    isTransparent={isTransparent}
                    textColor={textColor}
                    hoverTextColor={hoverTextColor}
                >
                    Boutique
                </NavLink>
            </li>
            <li className="nav-item-electromenager hidden lg:block">
                <NavLink
                    href="/Collections?category=Electroménager&page=1"
                    onClick={() => handleNavigation("electromenager")}
                    linkId="electromenager"
                    activeLink={activeLink}
                    isTransparent={isTransparent}
                    textColor={textColor}
                    hoverTextColor={hoverTextColor}
                >
                    Électroménager
                </NavLink>
            </li>
            <li className="nav-item-cuisine hidden xl:block">
                <NavLink
                    href="/Collections?category=Cuisine&page=1"
                    onClick={() => handleNavigation("cuisine")}
                    linkId="cuisine"
                    activeLink={activeLink}
                    isTransparent={isTransparent}
                    textColor={textColor}
                    hoverTextColor={hoverTextColor}
                >
                    Cuisine
                </NavLink>
            </li>
            <li className="nav-item-deco hidden xl:block">
                <NavLink
                    href="/Collections?category=Maison+et+Décoration&page=1"
                    onClick={() => handleNavigation("deco")}
                    linkId="deco"
                    activeLink={activeLink}
                    isTransparent={isTransparent}
                    textColor={textColor}
                    hoverTextColor={hoverTextColor}
                >
                    Déco Maison
                </NavLink>
            </li>
            <li className="nav-item-coiffure hidden 2xl:block">
                <NavLink
                    href="/Collections?category=Appareil+de+coiffure&page=1"
                    onClick={() => handleNavigation("coiffure")}
                    linkId="coiffure"
                    activeLink={activeLink}
                    isTransparent={isTransparent}
                    textColor={textColor}
                    hoverTextColor={hoverTextColor}
                >
                    Appareil de coiffure
                </NavLink>
            </li>
            <li className="nav-item-nouveaute hidden 2xl:block">
                <NavLink
                    href="/Collections?choice=new-product&page=1"
                    onClick={() => handleNavigation("nouveaute")}
                    linkId="nouveaute"
                    activeLink={activeLink}
                    isTransparent={isTransparent}
                    textColor={textColor}
                    hoverTextColor={hoverTextColor}
                >
                    Nouveauté
                </NavLink>
            </li>
        </ul>
    </nav>
);
export default DesktopNavigation