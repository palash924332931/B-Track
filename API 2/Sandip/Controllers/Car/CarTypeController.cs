using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CarSystem.Controllers.Car
{
    public class CarTypeController : ApiController
    {
        [Route("api/GetCarType")]
        [HttpGet]
        public HttpResponseMessage GetCarType(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetCarTypes(UserId).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show car type list. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostCarType")]
        [HttpPost]
        public HttpResponseMessage PostCarType([FromBody] JObject request)
        {
            if (request != null)
            {
                var CarType = JsonConvert.DeserializeObject<prGetCarTypes_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveCarType(CarType.CarTypeId, CarType.Type, CarType.Description, Int32.Parse( CarType.CreatedBy), CarType.UpdatedTime).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError,"System had filed to save car type information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,"Please correct your information and try again.");
            }


        }


        [Route("api/DeleteCarType")]
        [HttpGet]
        public HttpResponseMessage DeleteCarType(int TypeId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update CarTypes set Status='Delete' Where CarTypeId="+ TypeId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Car type has deleted.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show car type list. Please contact with admin.");
            }
        }
    }
}
