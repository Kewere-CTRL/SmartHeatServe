import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as Icons from 'react-icons/lu';

const Breadcrumbs = () => {
    const location = useLocation();
    const breadcrumbs = useSelector((state) => state.breadcrumbs.breadcrumbs);

    const pathnames = location.pathname.split('/').filter((x) => x);

    const getBreadcrumbData = (segment) => {
        const data = breadcrumbs[segment] || null;
        if (!data) return null;
        return {
            label: data.label || segment,
            icon: data.icon ? Icons[data.icon] : null,
            id: data.id || null,
        };
    };

    const breadcrumbPath = pathnames.reduce((acc, segment, index) => {
        if (isNaN(segment)) {
            const breadcrumbData = getBreadcrumbData(segment);

            if (breadcrumbData) {
                const { label, icon: Icon, id } = breadcrumbData;
                acc.push({
                    label,
                    Icon,
                    path: `/${pathnames.slice(0, index + 1).join('/')}`,
                    id,
                });
            }
        } else if (acc.length > 0) {
            acc[acc.length - 1].path += `/${segment}`;
        }

        return acc;
    }, []);

    return (
        breadcrumbPath.length > 0 && (
            <div>
                <div className="absolute h-[50px] inset-0 bg-gray-700 w-screen mt-[68px] -z-20"></div>
                <div className="container px-4 py-2.5 mt-[72px]">
                    <nav className="text-left text-lg leading-6 whitespace-nowrap -z-10 flex items-center">
                        {breadcrumbPath.map((breadcrumb, index) => {
                            const isLast = index === breadcrumbPath.length - 1;
                            return (
                                <React.Fragment key={breadcrumb.path}>
                                    {index > 0 && (
                                        <span className="text-gray-300 mx-2">/</span>
                                    )}
                                    {isLast ? (
                                        <span className="text-gray-300 flex items-center inline-flex">
                      {breadcrumb.Icon && <breadcrumb.Icon className="mr-1" />}
                                            {breadcrumb.label}
                    </span>
                                    ) : (
                                        <Link to={breadcrumb.path} className="text-white hover:underline flex items-center inline-flex">
                                            {breadcrumb.Icon && <breadcrumb.Icon className="mr-1" />}
                                            {breadcrumb.label}
                                        </Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </nav>
                </div>
            </div>
        )
    );
};

export default Breadcrumbs;
