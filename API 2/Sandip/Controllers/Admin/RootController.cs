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
    public class RootController : ApiController
    {
        [Route("api/GetRoots")]
        [HttpGet]
        public HttpResponseMessage GetRoots(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetRoots(UserId, 0, "All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show root list. Please contact with admin.");
            }
        }

        [Route("api/GetRoot")]
        [HttpGet]
        public HttpResponseMessage GetRoot(int UserId, int RootId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetRoots(UserId, RootId, "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show root details. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostRoot")]
        [HttpPost]
        public HttpResponseMessage PostRoot([FromBody] JObject request)
        {
            if (request != null)
            {
                var Root = JsonConvert.DeserializeObject<prGetRoots_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveRoot(Root.RootId, Root.RootName, Root.RootName, Root.StartPoint, Root.EndPoint, Root.Distance, Root.UnofficialDistance, Root.Status, Root.Notes, Root.TargetTrip, Root.CreatedBy, Root.Update).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save car type information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }


        }


        [Route("api/DeleteRoot")]
        [HttpGet]
        public HttpResponseMessage DeleteRoot(int RootId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update Roots set Status='Delete' Where RootId=" + RootId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Root information has deleted successfully.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root information. Please try agian.");
            }
        }
    }
}
