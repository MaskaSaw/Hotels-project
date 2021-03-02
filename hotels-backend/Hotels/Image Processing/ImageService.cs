using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.ImageProcessing
{
    public class ImageService
    {
        private readonly IWebHostEnvironment _hostEnvironment;

        public ImageService(IWebHostEnvironment webHostEnvironment)
        {
            _hostEnvironment = webHostEnvironment;
        }

        public async Task<string> SaveImageAsync(IFormFile image)
        {
            string imageName, imagePath;

            imageName = CreateUniqueName(Path.GetExtension(image.FileName));
            imagePath = Path.Combine(_hostEnvironment.WebRootPath, imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return imageName;
        }

        public void DeleteImage(string imageUrl)
        {
            Uri uri = new Uri(imageUrl);
            var imageName = Path.GetFileName(uri.LocalPath);
            var imagePath = Path.Combine(_hostEnvironment.WebRootPath, imageName);

            File.Delete(imagePath);
        }

        private string CreateUniqueName(string extension)
        {
            return $"{Guid.NewGuid()}{extension}";
        }
    }
}
