import type { SLParameters } from '@/types'

export enum WindowMessageOrigin {
  Same = '/',
  Any = '*',
}

export enum CrossDocumentMessageSource {
  Root = 'storylite_root',
  Iframe = 'storylite_iframe',
}

export enum CrossDocumentMessageType {
  UpdateParameters = 'update_parameters',
}

export type CrossDocumentMessage = {
  source?: CrossDocumentMessageSource
  type: string | CrossDocumentMessageType
  payload: CrossDocumentMessage['type'] extends CrossDocumentMessageType.UpdateParameters
    ? SLParameters
    : {
        [key: string]: any
      }
}
