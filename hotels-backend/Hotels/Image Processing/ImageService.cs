using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;

namespace Hotels.ImageProcessing
{
    public class ImageService
    {
        private readonly int imageNameLength = 20;
        private readonly IWebHostEnvironment _hostEnvironment;

        public ImageService(IWebHostEnvironment webHostEnvironment)
        {
            _hostEnvironment = webHostEnvironment;
        }

        public async System.Threading.Tasks.Task<string> SaveImageAsync(IFormFile image)
        {
            var imageName = CreateUniqueName(Path.GetExtension(image.FileName));
            var imagePath = Path.Combine(_hostEnvironment.WebRootPath, imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return imageName;
        }

        private string CreateUniqueName(string extension)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            Random random = new Random();

            var imageName = new string(Enumerable.Repeat(chars, imageNameLength)
                .Select(s => s[random.Next(s.Length)])
                .ToArray()
            );

            return imageName + extension;
        }
    }
}
