// Custom renderer for Ant breadcrumbs, to get rid of the # in the links
import React from "react";
import {Link} from "react-router-dom";

export function breadcrumbItemRender(route, params, routes, paths) {
	const last = routes.indexOf(route) === routes.length - 1;
	const url = "/" + paths.join('/');
	return last ? (
		<span>{route.breadcrumbName}</span>
	) : (
		<Link to={url}>{route.breadcrumbName}</Link>
	);
}
