//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Sandip.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class CarType
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CarType()
        {
            this.PartsDetails = new HashSet<PartsDetail>();
        }
    
        public int CarTypeId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public Nullable<int> CompanyId { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public string Status { get; set; }
        public Nullable<System.DateTime> Creation { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PartsDetail> PartsDetails { get; set; }
    }
}
