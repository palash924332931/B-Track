using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Accounts
{
    public class PaySlipController : ApiController
    {
        [Route("api/GetPaySlipList")]
        [HttpGet]
        public HttpResponseMessage GetPaySlipList(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetPaySlipDetails(UserId, 0,"", "All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show pay slip list. Please contact with admin.");
            }
        }
        [Route("api/GetPaySlipListOnDemand")]
        [HttpGet]
        public HttpResponseMessage GetPaySlipListOnDemand(int UserId,int PaySlipId,string BookNo, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetPaySlipDetails(UserId, PaySlipId, BookNo, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show pay slip list. Please contact with admin.");
            }
        }

        [Route("api/GetPaySlipListOnDemandApproval")]
        [HttpGet]
        public HttpResponseMessage GetPaySlipListOnDemandApproval(int UserId, int PaySlipId, string BookNo, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prUpdatePaySlipDetails(UserId, PaySlipId, BookNo, Type).FirstOrDefault();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show pay slip list. Please contact with admin.");
            }
        }
        [Route("api/GetPaySlipBookWise")]
        [HttpGet]
        public HttpResponseMessage GetPaySlipBookWise(int UserId, string BookNo)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetPaySlipDetails(UserId, 0, BookNo, "Book").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show pay slip list. Please contact with admin.");
            }
        }
        [Route("api/GetPaySlipBookOnDemand")]
        [HttpGet]
        public HttpResponseMessage GetPaySlipBookOnDemand(int UserId, string BookNo,string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetPaySlipDetails(UserId, 0, BookNo, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show pay slip list. Please contact with admin.");
            }
        }


        [Route("api/GetPayslip")]
        [HttpGet]
        public HttpResponseMessage GetPayslip(int UserId, int Id)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetPaySlipDetails(UserId, Id,"", "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show pay slip details. Please contact with admin.");
            }
        }

        [Route("api/GetPayslipBook")]
        [HttpGet]
        public HttpResponseMessage GetPayslipBook(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetPaySlipBook(UserId).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show pay slip book list. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostPayslip")]
        [HttpPost]
        public HttpResponseMessage PostPayslip([FromBody] JArray request)
        {
            if (request != null)
            {
                List< prGetPaySlipDetails_Result> PSlip = JsonConvert.DeserializeObject<prGetPaySlipDetails_Result[]>(request.ToString()).ToList();
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = "";
                        foreach (prGetPaySlipDetails_Result pSlip in PSlip) {
                            returnData = db.prSavePaySlip(pSlip.PaySlipId, pSlip.SlipNo, pSlip.BookNo, pSlip.Amount, pSlip.Status, Int32.Parse( pSlip.CreatedBy), pSlip.Update).FirstOrDefault();
                        }

                       // var returnData = db.prSavePaySlip(PSlip.PaySlipId, PSlip.SlipNo, RCost.CarTypeId, RCost.Cost, RCost.UnofficialCost, RCost.Status, RCost.Notes, RCost.CreatedBy, RCost.Update).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save pay slip information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }

        }

       
        [Route("api/PostPayslipForApproval")]
        [HttpPost]
        public HttpResponseMessage PostPayslipForApproval([FromBody] JArray request, int UserId, string Type)
        {
            if (request != null)
            {
                List<prGetPaySlipDetails_Result> PSlip = JsonConvert.DeserializeObject<prGetPaySlipDetails_Result[]>(request.ToString()).ToList();
                try
                {
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        foreach (prGetPaySlipDetails_Result pSlip in PSlip)
                        {
                            //returnData = db.prSavePaySlip(pSlip.PaySlipId, pSlip.SlipNo, pSlip.BookNo, pSlip.Amount, pSlip.Status, Int32.Parse(pSlip.CreatedBy), pSlip.Update).FirstOrDefault();
                            db.Database.ExecuteSqlCommand("Update PaySlipBook set Status='Approved', ApprovedBy="+ UserId + " Where PaySlipId="+ pSlip.PaySlipId);
                        }

                        // var returnData = db.prSavePaySlip(PSlip.PaySlipId, PSlip.SlipNo, RCost.CarTypeId, RCost.Cost, RCost.UnofficialCost, RCost.Status, RCost.Notes, RCost.CreatedBy, RCost.Update).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, "Your request successfully executed.");
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save pay slip information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }


        }


        [Route("api/DeletePaySlip")]
        [HttpGet]
        public HttpResponseMessage DeletePaySlip(int Id)
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

        [Route("api/DeletePaySlipBook")]
        [HttpGet]
        public HttpResponseMessage DeletePaySlipBook(int UserId,int PaySlipId,string BookNo,string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                   var returnresult= db.prDeletePaySlip(UserId, PaySlipId, BookNo,Type).FirstOrDefault(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root cost information. Please try agian.");
            }
        }
    }
}
