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
    public class DriverController : ApiController
    {
        [Route("api/GetDrivers")]
        [HttpGet]
        public HttpResponseMessage GetDrivers(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDriver(UserId, 0, "All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show driver list. Please contact with admin.");
            }
        }

        [Route("api/GetDriver")]
        [HttpGet]
        public HttpResponseMessage GetDriver(int UserId, int DriverId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDriver(UserId, DriverId, "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show driver list. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostDriver")]
        [HttpPost]
        public HttpResponseMessage PostDriver([FromBody] JObject request)
        {
            if (request != null)
            {
                var Driver = JsonConvert.DeserializeObject<prGetDriver_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveDriverDetails(Driver.DriverId, Driver.EmployeeId, Driver.Name, Driver.NameInBangla, Driver.ContactNo, Driver.DrivingLicense, Driver.PresentAddress, Driver.PermanentAddress, Driver.HelperName, Driver.HelperContactNo, Driver.Reference, Driver.Status, Driver.CreatedBy, Driver.Update, Driver.CorpJoinDate == null ? (DateTime?)null : Convert.ToDateTime( Driver.CorpJoinDate), Driver.DepotJoinDate == null ? (DateTime?)null : Convert.ToDateTime(Driver.DepotJoinDate), Driver.RetirementDate, Driver.ReasonForInactive,Driver.Grade, Driver.DateOfBirth ==null? (DateTime?)null :Convert.ToDateTime(Driver.DateOfBirth),Driver.FatherName).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save driver information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }


        }


        [Route("api/DeleteDriver")]
        [HttpGet]
        public HttpResponseMessage DeleteDriver(int DriverId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update Driver set Status='Delete' Where DriverId=" + DriverId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Driver information has deleted successfully.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete driver information. Please try agian.");
            }
        }
    }
}
