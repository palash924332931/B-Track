using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers
{
    public class CommonController : ApiController
    {
        [Route("api/GetUserOnRole")]
        [HttpGet]
        public HttpResponseMessage GetUserOnRole(string type)
        {
            try {
                //using (LOANDB db = new LOANDB())
                //{
                //    var returnData = db.vwUsers.Where(R => R.RoleName == type).ToList();
                //    //var result = Newtonsoft.Json.JsonConvert.SerializeObject(returnData, Newtonsoft.Json.Formatting.Indented);
                //    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                //}
            }
            catch (Exception ex) {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");
            }
            return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");

        }

        [Route("api/GetUserMenuDetails")]
        [HttpGet]
        public HttpResponseMessage GetUserMenuDetails(int UserId)
        {
            try
            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetMenuList(UserId).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");
            }
            return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");

        }

        [Route("api/GetUserMenuRoleWise")]
        [HttpGet]
        public HttpResponseMessage GetUserMenuRoleWise(int RoleId)
        {
            try
            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetMenuListRoleWise(RoleId).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");
            }
            return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");

        }

        [Route("api/PostRolePermission")]
        [HttpPost]
        public HttpResponseMessage PostRolePermission([FromBody] JArray request,int  RoleId, int UserId,int CompanyId)
        {
            if (request != null)
            {
                var RolePermission = JsonConvert.DeserializeObject<prGetMenuListRoleWise_Result[]>(request.ToString());
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        db.Database.ExecuteSqlCommand("Delete from Menupermission Where RoleId="+ RoleId+" AND CompanyId="+ CompanyId);
                        foreach (prGetMenuListRoleWise_Result permission in RolePermission) {
                            db.Database.ExecuteSqlCommand("Insert into Menupermission (RoleId,MenuId,IsPermit,CompanyId) Values (" + RoleId+","+ permission.MDetailsId+ ","+ permission.IsPermit + " ," + CompanyId + ")");
                        }
                        //var returnData = db.prSaveUser(User.Id, User.EmployeeId, User.Name, User.NameInBangla, User.Password, User.Status, User.PresentAddress, User.PermanentAddress, User.RoleId, User.ContactNo, Int32.Parse(User.CreatedBy), User.Update, User.CorpJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.CorpJoinDate), User.DepotJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.DepotJoinDate), User.RetirementDate == null ? (DateTime?)null : Convert.ToDateTime(User.RetirementDate), User.DateOfBirth == null ? (DateTime?)null : Convert.ToDateTime(User.DateOfBirth), User.Grade, User.FatherName).FirstOrDefault();
                        //var returnData = db.prSaveUser(User.Id, User.EmployeeId, User.Name, User.NameInBangla, User.Password, User.Status, User.PresentAddress, User.PermanentAddress, User.RoleId, User.ContactNo, Int32.Parse(User.CreatedBy), User.Update, User.CorpJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.CorpJoinDate), User.DepotJoinDate == null ? (DateTime?)null : Convert.ToDateTime(User.DepotJoinDate), User.RetirementDate == null ? (DateTime?)null : Convert.ToDateTime(User.RetirementDate), null, User.Grade).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, "Your request successfully saved");
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

        [Route("api/UpdateUserInfo")]
        [HttpGet]
        public HttpResponseMessage UpdateUserInfo(int UserId, string Lang, string Type)
        {
            try
            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.Database.ExecuteSqlCommand("Update Users Set Language='"+ Lang+"' Where Id="+ UserId);
                    //var result = Newtonsoft.Json.JsonConvert.SerializeObject(returnData, Newtonsoft.Json.Formatting.Indented);
                    return Request.CreateResponse(HttpStatusCode.OK, "Successfully updated.");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");
            }

        }

        [Route("api/SpecialActivity")]
        [HttpGet]
        public HttpResponseMessage SpecialActivity(int UserId, int CarLogId, string Type)
        {
            try
            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prSpecialActionOnCarLog(UserId, CarLogId, Type).FirstOrDefault();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "System has problem to pull user information.");
            }

        }
    }
}
