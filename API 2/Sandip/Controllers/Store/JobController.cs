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
    public class JobController : ApiController
    {

        [Route("api/GetJobList")]
        [HttpGet]
        public HttpResponseMessage GetJobList(int UserId, DateTime FromDate,DateTime ToDate, int JobId = 0, string Type = "All")
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    // var returnData = db.prGetVendorDetails(UserId, 0, "All").ToList();
                    var returnData = db.prGetJobList(UserId, FromDate, ToDate, JobId, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please contact with admin.");
            }
        }

        [Route("api/GetJobDetails")]
        [HttpGet]
        public HttpResponseMessage GetJobDetails(int UserId, DateTime JobStartDate, int JobId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    // var returnData = db.prGetVendorDetails(UserId, 0, "All").ToList();
                   // var returnData = db.prGetJobList(UserId, JobStartDate, JobId, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, "");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show employee list. Please contact with admin.");
            }
        }

        [Route("api/postJobInfo")]
        [HttpPost]
        public HttpResponseMessage postJobInfo([FromBody] JObject request)
        {
            if (request != null)
            {
                var Job = JsonConvert.DeserializeObject<prGetJobList_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveJobInfo(Job.JobId, Job.DriverId, Job.JobDate, Job.CarId, Job.JobDescription, Job.Status, Job.JobCompletedDate, Job.BusStatus, Job.AssignedMechanic, Job.Remark, Job.CreatedBy, Job.Created).FirstOrDefault();
                        //var returnData = db.prSaveUser(User.Id, User.EmployeeId, User.Name, User.NameInBangla, User.Password, User.Status, User.PresentAddress, User.PermanentAddress, User.RoleId, User.ContactNo, Int32.Parse(User.CreatedBy), User.Update, User.CorpJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.CorpJoinDate), User.DepotJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.DepotJoinDate), User.RetirementDate == null ? (DateTime?)null : Convert.ToDateTime(User.RetirementDate), null, User.Grade).FirstOrDefault();
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

        [AllowAnonymous]
        [Route("api/SaveJobDetails")]
        [HttpPost]
        public HttpResponseMessage SaveJobDetails([FromBody] JObject request)
        {
            if (request != null)
            {
                var Vendor = JsonConvert.DeserializeObject<prGetVendorDetails_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveVendorDetails(Vendor.VendorId, Vendor.Name, Vendor.ContactPerson, Vendor.ContactNo, Vendor.Remark, Vendor.Status, Vendor.ActivityType, Vendor.CreatedBy, Vendor.Address).FirstOrDefault();
                        //var returnData = db.prSaveUser(User.Id, User.EmployeeId, User.Name, User.NameInBangla, User.Password, User.Status, User.PresentAddress, User.PermanentAddress, User.RoleId, User.ContactNo, Int32.Parse(User.CreatedBy), User.Update, User.CorpJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.CorpJoinDate), User.DepotJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.DepotJoinDate), User.RetirementDate == null ? (DateTime?)null : Convert.ToDateTime(User.RetirementDate), null, User.Grade).FirstOrDefault();
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
    }
}
