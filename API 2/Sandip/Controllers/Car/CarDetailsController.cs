using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Car
{
    public class CarDetailsController : ApiController
    {
        [Route("api/GetBuses")]
        [HttpGet]
        public HttpResponseMessage GetBuses(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetCarDetails(UserId,0,"All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus list. Please contact with admin.");
            }
        }

        [Route("api/GetBus")]
        [HttpGet]
        public HttpResponseMessage GetBus(int UserId,int CarId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetCarDetails(UserId, CarId, "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus list. Please contact with admin.");
            }
        }

        [Route("api/GetBusesOnType")]
        [HttpGet]
        public HttpResponseMessage GetBusesOnType(int UserId, int Id,string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetCarDetails(UserId, Id, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus list. Please contact with admin.");
            }
        }
        [AllowAnonymous]
        [Route("api/PostBus")]
        [HttpPost]
        public HttpResponseMessage PostBus([FromBody] JObject request)
        {
            if (request != null)
            {
                var CarDetails = JsonConvert.DeserializeObject<CarDetail>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                         var returnData = db.prSaveCarDetails(CarDetails.CarId, CarDetails.RegistrationNo, CarDetails.RegistrationDate, CarDetails.CarTypeId, CarDetails.Status, CarDetails.ReasonForStop, CarDetails.NoOfSeat, CarDetails.OnRootDate, CarDetails.TotalDistance, CarDetails.Notes, CarDetails.CreatedBy, CarDetails.Update).FirstOrDefault();
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


        [Route("api/DeleteBus")]
        [HttpGet]
        public HttpResponseMessage DeleteBus(int CarId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update CarDetails set Status='Delete' Where CarId=" + CarId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Bus information has deleted successfully.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete bus information. Please try agian.");
            }
        }
    }
}
