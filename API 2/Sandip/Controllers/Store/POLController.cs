using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Store
{
    public class POLController : ApiController
    {

        [Route("api/GetPOLList")]
        [HttpGet]
        public HttpResponseMessage GetPOLList(int UserId,int POLId, DateTime FromDate, DateTime ToDate,string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    // var returnData = db.prGetVendorDetails(UserId, 0, "All").ToList();
                    var returnData = db.prGetPol(UserId, POLId, FromDate, ToDate, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show employee list. Please contact with admin.");
            }
        }

        [Route("api/postPOL")]
        [HttpPost]
        public HttpResponseMessage postPOL([FromBody] JObject request)
        {
            if (request != null)
            {
                var polDetails = JsonConvert.DeserializeObject<prGetPol_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSavePOLDetails(polDetails.POLId, polDetails.CarId, polDetails.CheckInDate == null ? (DateTime?)null : Convert.ToDateTime(polDetails.CheckInDate), polDetails.DriverId, polDetails.IssuedById,
                            Convert.ToDecimal(polDetails.CNG), Convert.ToDecimal(polDetails.Diesel), Convert.ToDecimal(polDetails.EngineOil),
                           Convert.ToDecimal(polDetails.PowerOil), Convert.ToDecimal(polDetails.GearOil), Convert.ToDecimal(polDetails.Grease),
                            polDetails.Status, polDetails.Remark, polDetails.Createdby, polDetails.Created).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }
        }

        [Route("api/DeletePOL")]
        [HttpGet]
        public HttpResponseMessage DeletePOL(int UserId, int POLId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    // var returnData = db.prGetVendorDetails(UserId, 0, "All").ToList();
                    var returnData = db.prDeletePOLRecord(UserId, POLId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Successfully deleted.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show employee list. Please contact with admin.");
            }
        }
    }
}
