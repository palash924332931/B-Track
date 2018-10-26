﻿using Newtonsoft.Json;
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
    public class StoreController : ApiController
    {   

        [Route("api/GetPartsList")]
        [HttpGet]
        public HttpResponseMessage GetPartsList(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    // var returnData = db.prGetVendorDetails(UserId, 0, "All").ToList();
                    var returnData = db.prGetPartsDetails(UserId).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show employee list. Please contact with admin.");
            }
        }
        [Route("api/GetStoreInfoById")]
        [HttpGet]
        public HttpResponseMessage GetStoreInfoById(int userId,int jobId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    // var returnData = db.prGetVendorDetails(UserId, 0, "All").ToList();
                    var returnData = db.VWStoreInfoes.Where(x=>x.JobIdRef== jobId).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show employee list. Please contact with admin.");
            }
        }

        [Route("api/store/PostStoreInfoOut")]
        [HttpPost]
        public HttpResponseMessage PostStorePartsOut([FromBody] JObject request)
        {
            var s = JsonConvert.DeserializeObject<StoreInfo>(request.ToString());
            try
            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prSaveStoreOut(s.StoreInfoId,s.JobIdRef,s.PartsId,s.QuantityOut,s.Status,s.CreatedBy,s.Created).FirstOrDefault();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


    }
}
