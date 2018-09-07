using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Manager
{
    public class POLManagerController : ApiController
    {

        [Route("api/GetDailyPOLLogByDate")]
        [HttpGet]
        public HttpResponseMessage GetDailyPOLLogByDate(int UserId, string Type, DateTime FromDate, DateTime ToDate)
        {
            
            try
            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData=db.prGetDailyPOLLog(UserId, FromDate, ToDate, 0, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show list. Please contact with admin.");
            }
        }
    }
}
