using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Linq;
using System.Web;

namespace Sandip.JsonModel
{
    [DataContract]
    public class ResponseListJson<T>
    {
        [DataMember]
        public Int64 ID { get; set; }

        [DataMember]
        public string Msg { get; set; }

        [DataMember]
        public bool IsError { get; set; }

        [DataMember]
        public T List { get; set; }
    }
}