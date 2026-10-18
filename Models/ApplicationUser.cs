using System.ComponentModel.DataAnnotations; // DataAnnotations, .NET framework'ünde veri doğrulama ve modelleme işlemleri için kullanılan bir kütüphanedir. Bu kütüphane, sınıfların özelliklerine eklenen öznitelikler (attributes) aracılığıyla veri doğrulama kurallarını tanımlamak için kullanılır. Örneğin, bir özelliğin zorunlu olup olmadığını, maksimum uzunluğunu veya belirli bir formatta olup olmadığını belirlemek için kullanılabilir. DataAnnotations, model tabanlı doğrulama ve kullanıcı arayüzü doğrulaması gibi senaryolarda yaygın olarak kullanılır.
using Microsoft.AspNetCore.Identity; // IdentityUser sınıfı, ASP.NET Core Identity framework'ünde kullanıcı kimlik doğrulama ve yetkilendirme işlemleri için kullanılan temel bir sınıftır. Bu sınıf, kullanıcıyla ilgili temel özellikleri ve işlevleri sağlar. Örneğin, kullanıcı adı, e-posta adresi, şifre hash'i gibi bilgileri içerir. IdentityUser sınıfı, kullanıcı yönetimi ve kimlik doğrulama süreçlerinde kullanılmak üzere tasarlanmıştır.

// bir veritabanı tablosunu temsil 
// eden sınıfımızdır. IdentityUser sınıfını 
// miras alarak kullanıcıyla ilgili temel özellikleri 
// içerir. Bu sınıf, kullanıcı 
// kimlik doğrulama ve 
// yetkilendirme 
// işlemlerinde kullanılacak olan kullanıcı 
// modelini temsil eder.


namespace TodoApp.Api.Models;


public class ApplicationUser : IdentityUser
{
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
}