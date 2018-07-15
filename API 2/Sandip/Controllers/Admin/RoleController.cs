using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Admin
{
    public class RoleController : ApiController
    {
        [Route("api/GetRoles")]
        [HttpGet]
        public HttpResponseMessage GetRoles(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetRoles(UserId).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show role list. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostRole")]
        [HttpPost]
        public HttpResponseMessage PostRole([FromBody] JObject request)
        {
            if (request != null)
            {
                var Role = JsonConvert.DeserializeObject<prGetRoles_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveRole(Role.RoleId,Role.Name,Int32.Parse( Role.CreatedBy), Role.Update).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save role information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to execute your request. Please try again.");
            }


        }


        [Route("api/DeleteRole")]
        [HttpGet]
        public HttpResponseMessage DeleteRole(int RoleId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update Roles set Status='Delete' Where RoleId=" + RoleId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Role has deleted successfully.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete role information. Please contact with admin.");
            }
        }
    }
}
