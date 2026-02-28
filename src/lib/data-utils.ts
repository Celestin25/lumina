/**
 * Strips massive Base64 strings from model/user objects before they are passed 
 * to Client Components or serialized into the HTML payload.
 * This prevents "Connection closed" errors and client-side crashes on deployment.
 */
export function cleanModelData(model: any) {
  if (!model) return model;

  const cleanPhoto = (photo: any) => {
    if (photo && photo.url && photo.url.startsWith('data:')) {
      return {
        ...photo,
        url: `/api/photos/${photo.id}`,
      };
    }
    return photo;
  };

  const cleanedModel = { ...model };

  // Handle a single model profile
  if (cleanedModel.photos) {
    cleanedModel.photos = cleanedModel.photos.map(cleanPhoto);
  }

  // Handle a model profile nested inside a user object
  if (cleanedModel.modelProfile && cleanedModel.modelProfile.photos) {
    cleanedModel.modelProfile.photos = cleanedModel.modelProfile.photos.map(cleanPhoto);
  }

  // Handle user avatar itself
  if (cleanedModel.image && cleanedModel.image.startsWith('data:') && cleanedModel.image.length > 1000) {
    cleanedModel.image = `/api/avatar/${cleanedModel.id}`;
  }

  return cleanedModel;
}

export function cleanModelsList(models: any[]) {
  if (!models || !Array.isArray(models)) return models;
  return models.map(cleanModelData);
}
