import { DeliveryError, IContentItem, camelCasePropertyNameResolver, createDeliveryClient } from '@kontent-ai/delivery-sdk';
import { defaultEnvId, defaultPreviewKey, deliveryApiDomain, deliveryPreviewApiDomain } from '../utils/env';
import { ExportModule, Tour, contentTypes } from '../../models';
const sourceTrackingHeaderName = 'X-KC-SOURCE';
const defaultDepth = 10;

const getDeliveryClient = ({ envId, previewApiKey }: ClientConfig) => createDeliveryClient({
  environmentId: envId,
  globalHeaders: () => [
    {
      header: sourceTrackingHeaderName,
      value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
    }
  ],
  propertyNameResolver: camelCasePropertyNameResolver,
  proxy: {
    baseUrl: deliveryApiDomain,
    basePreviewUrl: deliveryPreviewApiDomain,
  },
  previewApiKey: defaultEnvId === envId ? defaultPreviewKey : previewApiKey
});

type ClientConfig = {
  envId: string,
  previewApiKey?: string
}

export const getItemByCodename = <ItemType extends IContentItem>(config: ClientConfig, codename: string, usePreview: boolean): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .item(codename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.item as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });
}

export const getItemById = <ItemType extends IContentItem>(config: ClientConfig, id: string, usePreview: boolean): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .items()
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .limitParameter(1)
    .equalsFilter(`system.id`, id)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.items[0] as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });
}

export const getItemByUrlSlug = <ItemType extends IContentItem>(config: ClientConfig, url: string, elementCodename: string = "url", usePreview: boolean): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .items()
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .limitParameter(1)
    .equalsFilter(`elements.${elementCodename}`, url)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.items[0] as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });
}

export const getTourByCodename = (config: ClientConfig, tourCodename: string, usePreview: boolean) =>
  getDeliveryClient(config)
    .items()
    .limitParameter(1)
    .equalsFilter(`system.codename`, tourCodename)
    .depthParameter(defaultDepth)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      } ""
      return res.data.items[0]
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });

export const getTourExportByCodename = (config: ClientConfig, tourCodename: string, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<ExportModule>()
    .type(contentTypes.export_module.codename)
    .limitParameter(1)
    .equalsFilter(`system.codename`, tourCodename)
    .depthParameter(defaultDepth)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      } ""
      return res.data.items[0] as ExportModule
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });

export const getAllTours = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Tour>()
    .type(contentTypes.tour.codename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);