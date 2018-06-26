using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Sandip
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            
            //EnableCorsAttribute cors = new EnableCorsAttribute("*", "Content-Type", "GET, HEAD, OPTIONS, POST, PUT")
            //EnableCorsAttribute cors = new EnableCorsAttribute("*", "*", "GET, HEAD, OPTIONS, POST, PUT");
            //cors.SupportsCredentials = true;
            //config.EnableCors(cors);
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Formatters.JsonFormatter.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
            
        }
    }
}
