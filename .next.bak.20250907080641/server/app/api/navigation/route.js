"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/navigation/route";
exports.ids = ["app/api/navigation/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnavigation%2Froute&page=%2Fapi%2Fnavigation%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnavigation%2Froute.ts&appDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnavigation%2Froute&page=%2Fapi%2Fnavigation%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnavigation%2Froute.ts&appDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_daniel_OneDrive_Town_Inn_Suites_Desktop_innstastay_app_api_navigation_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/navigation/route.ts */ \"(rsc)/./app/api/navigation/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/navigation/route\",\n        pathname: \"/api/navigation\",\n        filename: \"route\",\n        bundlePath: \"app/api/navigation/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\daniel\\\\OneDrive - Town Inn Suites\\\\Desktop\\\\innstastay\\\\app\\\\api\\\\navigation\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_daniel_OneDrive_Town_Inn_Suites_Desktop_innstastay_app_api_navigation_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/navigation/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZuYXZpZ2F0aW9uJTJGcm91dGUmcGFnZT0lMkZhcGklMkZuYXZpZ2F0aW9uJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGbmF2aWdhdGlvbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNkYW5pZWwlNUNPbmVEcml2ZSUyMC0lMjBUb3duJTIwSW5uJTIwU3VpdGVzJTVDRGVza3RvcCU1Q2lubnN0YXN0YXklNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q2RhbmllbCU1Q09uZURyaXZlJTIwLSUyMFRvd24lMjBJbm4lMjBTdWl0ZXMlNUNEZXNrdG9wJTVDaW5uc3Rhc3RheSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDa0Q7QUFDL0g7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbm5zdGFzdGF5Lz8zOTk1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXGRhbmllbFxcXFxPbmVEcml2ZSAtIFRvd24gSW5uIFN1aXRlc1xcXFxEZXNrdG9wXFxcXGlubnN0YXN0YXlcXFxcYXBwXFxcXGFwaVxcXFxuYXZpZ2F0aW9uXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9uYXZpZ2F0aW9uL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbmF2aWdhdGlvblwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvbmF2aWdhdGlvbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGRhbmllbFxcXFxPbmVEcml2ZSAtIFRvd24gSW5uIFN1aXRlc1xcXFxEZXNrdG9wXFxcXGlubnN0YXN0YXlcXFxcYXBwXFxcXGFwaVxcXFxuYXZpZ2F0aW9uXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9uYXZpZ2F0aW9uL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnavigation%2Froute&page=%2Fapi%2Fnavigation%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnavigation%2Froute.ts&appDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/navigation/route.ts":
/*!*************************************!*\
  !*** ./app/api/navigation/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_cms_navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/cms/navigation */ \"(rsc)/./lib/cms/navigation.ts\");\n\n\nasync function GET() {\n    try {\n        const nav = await (0,_lib_cms_navigation__WEBPACK_IMPORTED_MODULE_1__.getNavigation)();\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(nav || {\n            mainMenu: [],\n            footerMenu: []\n        });\n    } catch  {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            mainMenu: [],\n            footerMenu: []\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL25hdmlnYXRpb24vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBQ1U7QUFFN0MsZUFBZUU7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLE1BQU0sTUFBTUYsa0VBQWFBO1FBQy9CLE9BQU9ELHFEQUFZQSxDQUFDSSxJQUFJLENBQUNELE9BQU87WUFBRUUsVUFBVSxFQUFFO1lBQUVDLFlBQVksRUFBRTtRQUFDO0lBQ2pFLEVBQUUsT0FBTTtRQUNOLE9BQU9OLHFEQUFZQSxDQUFDSSxJQUFJLENBQUM7WUFBRUMsVUFBVSxFQUFFO1lBQUVDLFlBQVksRUFBRTtRQUFDO0lBQzFEO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbm5zdGFzdGF5Ly4vYXBwL2FwaS9uYXZpZ2F0aW9uL3JvdXRlLnRzPzRhZDkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXHJcbmltcG9ydCB7IGdldE5hdmlnYXRpb24gfSBmcm9tICdAL2xpYi9jbXMvbmF2aWdhdGlvbidcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG5hdiA9IGF3YWl0IGdldE5hdmlnYXRpb24oKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKG5hdiB8fCB7IG1haW5NZW51OiBbXSwgZm9vdGVyTWVudTogW10gfSlcclxuICB9IGNhdGNoIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1haW5NZW51OiBbXSwgZm9vdGVyTWVudTogW10gfSlcclxuICB9XHJcbn1cclxuXHJcblxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0TmF2aWdhdGlvbiIsIkdFVCIsIm5hdiIsImpzb24iLCJtYWluTWVudSIsImZvb3Rlck1lbnUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/navigation/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/cms/navigation.ts":
/*!*******************************!*\
  !*** ./lib/cms/navigation.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getNavigation: () => (/* binding */ getNavigation)\n/* harmony export */ });\n/* harmony import */ var _sanity_lib_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/sanity/lib/client */ \"(rsc)/./sanity/lib/client.ts\");\n\nasync function getNavigation() {\n    const query = `*[_type == \"navigation\"][0]{ mainMenu, footerMenu }`;\n    return _sanity_lib_client__WEBPACK_IMPORTED_MODULE_0__.client.fetch(query);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvY21zL25hdmlnYXRpb24udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNEM7QUFFckMsZUFBZUM7SUFDcEIsTUFBTUMsUUFBUSxDQUFDLG1EQUFtRCxDQUFDO0lBQ25FLE9BQU9GLHNEQUFNQSxDQUFDRyxLQUFLLENBQUNEO0FBQ3RCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW5uc3Rhc3RheS8uL2xpYi9jbXMvbmF2aWdhdGlvbi50cz8zMDc0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsaWVudCB9IGZyb20gJ0Avc2FuaXR5L2xpYi9jbGllbnQnXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmF2aWdhdGlvbigpIHtcclxuICBjb25zdCBxdWVyeSA9IGAqW190eXBlID09IFwibmF2aWdhdGlvblwiXVswXXsgbWFpbk1lbnUsIGZvb3Rlck1lbnUgfWBcclxuICByZXR1cm4gY2xpZW50LmZldGNoKHF1ZXJ5KVxyXG59XHJcblxyXG5cclxuIl0sIm5hbWVzIjpbImNsaWVudCIsImdldE5hdmlnYXRpb24iLCJxdWVyeSIsImZldGNoIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/cms/navigation.ts\n");

/***/ }),

/***/ "(rsc)/./sanity/env.ts":
/*!***********************!*\
  !*** ./sanity/env.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apiVersion: () => (/* binding */ apiVersion),\n/* harmony export */   dataset: () => (/* binding */ dataset),\n/* harmony export */   projectId: () => (/* binding */ projectId),\n/* harmony export */   serpapiKey: () => (/* binding */ serpapiKey)\n/* harmony export */ });\nconst apiVersion = \"2023-05-03\";\nconst dataset = \"production\";\nconst projectId = \"6rewx4dr\";\nconst serpapiKey = process.env.SANITY_STUDIO_SERPAPI_KEY;\nfunction assertValue(v, errorMessage) {\n    if (v === undefined) {\n        throw new Error(errorMessage);\n    }\n    return v;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zYW5pdHkvZW52LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBTyxNQUFNQSxhQUFhLGFBQVk7QUFFL0IsTUFBTUMsVUFBVSxhQUFZO0FBRTVCLE1BQU1DLFlBQVksV0FBVTtBQUU1QixNQUFNQyxhQUFhQyxRQUFRQyxHQUFHLENBQUNDLHlCQUF5QjtBQUUvRCxTQUFTQyxZQUFlQyxDQUFnQixFQUFFQyxZQUFvQjtJQUM1RCxJQUFJRCxNQUFNRSxXQUFXO1FBQ25CLE1BQU0sSUFBSUMsTUFBTUY7SUFDbEI7SUFFQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW5uc3Rhc3RheS8uL3Nhbml0eS9lbnYudHM/MTZkYiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgYXBpVmVyc2lvbiA9ICcyMDIzLTA1LTAzJ1xuXG5leHBvcnQgY29uc3QgZGF0YXNldCA9ICdwcm9kdWN0aW9uJ1xuXG5leHBvcnQgY29uc3QgcHJvamVjdElkID0gJzZyZXd4NGRyJ1xuXG5leHBvcnQgY29uc3Qgc2VycGFwaUtleSA9IHByb2Nlc3MuZW52LlNBTklUWV9TVFVESU9fU0VSUEFQSV9LRVlcblxuZnVuY3Rpb24gYXNzZXJ0VmFsdWU8VD4odjogVCB8IHVuZGVmaW5lZCwgZXJyb3JNZXNzYWdlOiBzdHJpbmcpOiBUIHtcbiAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpXG4gIH1cblxuICByZXR1cm4gdlxufVxuIl0sIm5hbWVzIjpbImFwaVZlcnNpb24iLCJkYXRhc2V0IiwicHJvamVjdElkIiwic2VycGFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJTQU5JVFlfU1RVRElPX1NFUlBBUElfS0VZIiwiYXNzZXJ0VmFsdWUiLCJ2IiwiZXJyb3JNZXNzYWdlIiwidW5kZWZpbmVkIiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./sanity/env.ts\n");

/***/ }),

/***/ "(rsc)/./sanity/lib/client.ts":
/*!******************************!*\
  !*** ./sanity/lib/client.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   client: () => (/* binding */ client)\n/* harmony export */ });\n/* harmony import */ var next_sanity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-sanity */ \"(rsc)/./node_modules/@sanity/client/dist/index.browser.js\");\n/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env */ \"(rsc)/./sanity/env.ts\");\n\n\nconst client = (0,next_sanity__WEBPACK_IMPORTED_MODULE_1__.createClient)({\n    projectId: _env__WEBPACK_IMPORTED_MODULE_0__.projectId,\n    dataset: _env__WEBPACK_IMPORTED_MODULE_0__.dataset,\n    apiVersion: _env__WEBPACK_IMPORTED_MODULE_0__.apiVersion,\n    useCdn: true\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zYW5pdHkvbGliL2NsaWVudC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEM7QUFFYTtBQUVoRCxNQUFNSSxTQUFTSix5REFBWUEsQ0FBQztJQUNqQ0csU0FBU0EsNkNBQUFBO0lBQ1RELE9BQU9BLDJDQUFBQTtJQUNQRCxVQUFVQSw4Q0FBQUE7SUFDVkksUUFBUTtBQUNWLEdBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbm5zdGFzdGF5Ly4vc2FuaXR5L2xpYi9jbGllbnQudHM/NzdhYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICduZXh0LXNhbml0eSdcblxuaW1wb3J0IHsgYXBpVmVyc2lvbiwgZGF0YXNldCwgcHJvamVjdElkIH0gZnJvbSAnLi4vZW52J1xuXG5leHBvcnQgY29uc3QgY2xpZW50ID0gY3JlYXRlQ2xpZW50KHtcbiAgcHJvamVjdElkLFxuICBkYXRhc2V0LFxuICBhcGlWZXJzaW9uLFxuICB1c2VDZG46IHRydWUsIC8vIFNldCB0byBmYWxzZSBpZiBzdGF0aWNhbGx5IGdlbmVyYXRpbmcgcGFnZXMsIHVzaW5nIElTUiBvciB0YWctYmFzZWQgcmV2YWxpZGF0aW9uXG59KVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsImFwaVZlcnNpb24iLCJkYXRhc2V0IiwicHJvamVjdElkIiwiY2xpZW50IiwidXNlQ2RuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./sanity/lib/client.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@sanity","vendor-chunks/rxjs","vendor-chunks/next","vendor-chunks/get-it","vendor-chunks/tslib","vendor-chunks/nanoid"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnavigation%2Froute&page=%2Fapi%2Fnavigation%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnavigation%2Froute.ts&appDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdaniel%5COneDrive%20-%20Town%20Inn%20Suites%5CDesktop%5Cinnstastay&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();