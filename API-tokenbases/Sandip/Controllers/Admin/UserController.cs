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
    public class UserController : ApiController
    {
        [Route("api/GetUsers")]
        [HttpGet]
        public HttpResponseMessage GetUsers(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetUsers(UserId, 0, "All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show employee list. Please contact with admin.");
            }
        }

        [Route("api/GetUser")]
        [HttpGet]
        public HttpResponseMessage GetUser(int UserId, int Id)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetUsers(UserId, Id, "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show employee details. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostUser")]
        [HttpPost]
        public HttpResponseMessage PostUser([FromBody] JObject request)
        {
            if (request != null)
            {
                var User = JsonConvert.DeserializeObject<prGetUsers_Result>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveUser(User.Id, User.EmployeeId, User.Name, User.NameInBangla, User.Password, User.Status, User.PresentAddress, User.PermanentAddress, User.RoleId, User.ContactNo, Int32.Parse( User.CreatedBy), User.Update, User.CorpJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.CorpJoinDate), User.DepotJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.DepotJoinDate), User.RetirementDate == null ? (DateTime?)null : Convert.ToDateTime(User.RetirementDate), User.DateOfBirth == null ? (DateTime?)null : Convert.ToDateTime(User.DateOfBirth),User.Grade,User.FatherName).FirstOrDefault();
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


        [Route("api/DeleteUser")]
        [HttpGet]
        public HttpResponseMessage DeleteUser(int Id)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update Users set Status='Delete' Where Id=" + Id);
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
