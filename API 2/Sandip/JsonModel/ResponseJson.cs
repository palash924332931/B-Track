using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Linq;
using System.Web;

namespace Sandip.JsonModel
{
    [DataContract]
    public class ResponseJson
    {
        [DataMember]
        public Int64? ID { get; set; }
        [DataMember]
        public object Data { get; set; }
        [DataMember]
        public string Msg { get; set; }

        [DataMember]
        public bool IsError { get; set; }
    }
}