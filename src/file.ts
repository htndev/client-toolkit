export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise(r => {
    const reader = new FileReader();

    reader.onloadend = () => r(reader.result as string);

    reader.readAsDataURL(file);
  });

export const dataUrlToBlob = (dataUrl: string): Promise<Blob> => fetch(dataUrl).then(response => response.blob());
