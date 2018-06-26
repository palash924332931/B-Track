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
    public class RootCostController : ApiController
    {
        [Route("api/GetRootCostList")]
        [HttpGet]
        public HttpResponseMessage GetRootCostList(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetRootCost(UserId, 0, "All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show root cost list. Please contact with admin.");
            }
        }

        [Route("api/GetRootCost")]
        [HttpGet]
        public HttpResponseMessage GetRootCost(int UserId, int Id)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetRootCost(UserId, Id, "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show root cost details. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostRootCost")]
        [HttpPost]
        public HttpResponseMessage PostRootCost([FromBody] JObject request)
        {
            if (request != null)
            {
                var RCost = JsonConvert.DeserializeObject<prGetRootCost_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveRootCost(RCost.RootCostId, RCost.RootId, RCost.CarTypeId, RCost.FirstTripIncome, RCost.SecondTripIncome, RCost.ThirdTripIncome, RCost.UnFirstTripIncome, RCost.UnSecondTripIncome, RCost.UnThirdTripIncome, RCost.Status, RCost.Notes, RCost.CreatedBy, RCost.Update).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save root cost information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }


        }


        [Route("api/DeleteRootCost")]
        [HttpGet]
        public HttpResponseMessage DeleteRootCost(int Id)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update RootCost set Status='Delete' Where RootCostid=" + Id);
                    return Request.CreateResponse(HttpStatusCode.OK, "Root cost information has deleted successfully.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root cost information. Please try agian.");
            }
        }
    }
}
