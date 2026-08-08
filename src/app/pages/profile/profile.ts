import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
selectedFile: File | null = null;

  selectedFileName = '';

  imagePreview: string | ArrayBuffer | null = null;

  errorMessage = '';

  allowedMimeTypes = ['image/png', 'image/jpeg', 'image/bmp'];

  async selectImage(): Promise<void> {
    this.errorMessage = '';

    try {
      // Open file picker
      const [fileHandle] = await (window as any).showOpenFilePicker({
        multiple: false,

        excludeAcceptAllOption: true,

        types: [
          {
            description: 'Allowed Images',

            accept: {
              'image/png': ['.png'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/bmp': ['.bmp'],
            },
          },
        ],
      });

      // Get selected file
      const file = await fileHandle.getFile();

      // Validate MIME type
      if (!this.allowedMimeTypes.includes(file.type)) {
        this.errorMessage = 'Only BMP, PNG, JPG and JPEG images are allowed';

        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        this.errorMessage = 'Maximum allowed size is 5MB';

        return;
      }

      // Store file
      this.selectedFile = file;

      this.selectedFileName = file.name;

      // Create preview
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.log('File selection cancelled');
    }
  }
}
