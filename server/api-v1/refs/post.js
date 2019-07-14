import omit from 'lodash/omit';

import { DESCRIPTION, TAGS } from '../../../shared/constants';

const post = {
  type: 'object',
  additionalProperties: false,
  required: ['key'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      readOnly: true,
    },
    rotate: {
      type: 'integer',
      enum: [0, 90, 180, 270],
      nullable: true,
    },

    timestamp: {
      type: 'integer',
      description: 'Integer unix epoch timestamp',
      maximum: 9999999999,
      nullable: true,
    },
    date: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      nullable: true,
      description: 'Date time from legacy tumblr images',
    },
    originalUrl: {
      type: 'string',
      format: 'uri',
      readOnly: true,
      nullable: true,
      description: 'Original URL from legacy tumblr images',
    },
    [DESCRIPTION]: {
      type: 'string',
      description: 'Descrtipion/caption for the post',
      nullable: true,
      example: 'a description',
    },
    key: {
      type: 'string',
      pattern: '.jpg$',
      example: 'something.jpg',
    },
    status: {
      type: 'string',
      enum: ['active', 'deleted'],
      readOnly: true,
      example: 'active',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
    },
    isPending: {
      type: 'boolean',
    },
    [TAGS]: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid',
      },
    },
    etag: {
      type: 'string',
      nullable: true,
    },

    apertureValue: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted',
      readOnly: true,
    },
    brightnessValue: {
      nullable: true,
      type: 'string',
      description: 'exif data brightnessValue',
      readOnly: true,
    },
    colorSpace: {
      nullable: true,
      type: 'string',
      description: 'exif data colorSpace',
      readOnly: true,
    },
    contrast: {
      nullable: true,
      type: 'string',
      description: 'exif data contrast',
      readOnly: true,
    },
    createDate: {
      nullable: true,
      type: 'string',
      description: 'exif data createDate',
      readOnly: true,
    },
    customRendered: {
      nullable: true,
      type: 'string',
      description: 'exif data customRendered',
      readOnly: true,
    },
    dateTimeOriginal: {
      nullable: true,
      type: 'string',
      description: 'exif data dateTimeOriginal',
      readOnly: true,
    },
    digitalZoomRatio: {
      nullable: true,
      type: 'string',
      description: 'exif data digitalZoomRatio',
      readOnly: true,
    },
    exifImageHeight: {
      nullable: true,
      type: 'string',
      description: 'exif data exifImageHeight',
      readOnly: true,
    },
    exifImageWidth: {
      nullable: true,
      type: 'string',
      description: 'exif data exifImageWidth',
      readOnly: true,
    },
    exposureCompensation: {
      nullable: true,
      type: 'string',
      description: 'exif data exposureCompensation',
      readOnly: true,
    },
    exposureMode: {
      nullable: true,
      type: 'string',
      description: 'exif data exposureMode',
      readOnly: true,
    },
    exposureProgram: {
      nullable: true,
      type: 'string',
      description: 'exif data exposureProgram',
      readOnly: true,
    },
    exposureTime: {
      nullable: true,
      type: 'string',
      description: 'exif data exposureTime',
      readOnly: true,
    },
    flash: {
      nullable: true,
      type: 'string',
      description: 'exif data flash',
      readOnly: true,
    },
    fNumber: {
      nullable: true,
      type: 'string',
      description: 'exif data fNumber',
      readOnly: true,
    },
    focalLength: {
      nullable: true,
      type: 'string',
      description: 'exif data focalLength',
      readOnly: true,
    },
    focalLengthIn35mmFormat: {
      nullable: true,
      type: 'string',
      description: 'exif data focalLengthIn35mmFormat',
      readOnly: true,
    },
    gpsAltitude: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsAltitude',
      readOnly: true,
    },
    gpsAltitudeRef: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsAltitudeRef',
      readOnly: true,
    },
    gpsDateStamp: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsDateStamp',
      readOnly: true,
    },
    gpsDOP: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsDOP',
      readOnly: true,
    },
    gpsLatitude: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsLatitude',
      readOnly: true,
    },
    gpsLatitudeRef: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsLatitudeRef',
      readOnly: true,
    },
    gpsLongitude: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsLongitude',
      readOnly: true,
    },
    gpsLongitudeRef: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsLongitudeRef',
      readOnly: true,
    },
    gpsTimeStamp: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsTimeStamp',
      readOnly: true,
    },
    gpsVersionID: {
      nullable: true,
      type: 'string',
      description: 'exif data gpsVersionID',
      readOnly: true,
    },
    imageHeight: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for imageHeight',
      readOnly: true,
    },
    imageWidth: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for imageWidth',
      readOnly: true,
    },
    interopIndex: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for interopIndex',
      readOnly: true,
    },
    ISO: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for ISO',
      readOnly: true,
    },
    make: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for make',
      readOnly: true,
    },
    maxApertureValue: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for maxApertureValue',
      readOnly: true,
    },
    meteringMode: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for meteringMode',
      readOnly: true,
    },
    model: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for model',
      readOnly: true,
    },
    modifyDate: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for modifyDate',
      readOnly: true,
    },
    orientation: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for orientation',
    },
    resolutionUnit: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for resolutionUnit',
      readOnly: true,
    },
    saturation: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for saturation',
      readOnly: true,
    },
    sceneCaptureType: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for sceneCaptureType',
      readOnly: true,
    },
    sensingMethod: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for sensingMethod',
      readOnly: true,
    },
    sharpness: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for sharpness',
      readOnly: true,
    },
    shutterSpeedValue: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for shutterSpeedValue',
      readOnly: true,
    },
    software: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for software',
      readOnly: true,
    },
    subjectDistance: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for subjectDistance',
      readOnly: true,
    },
    subjectDistanceRange: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for subjectDistanceRange',
      readOnly: true,
    },
    subSecTime: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for subSecTime',
      readOnly: true,
    },
    subSecTimeDigitized: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for subSecTimeDigitized',
      readOnly: true,
    },
    subSecTimeOriginal: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for subSecTimeOriginal',
      readOnly: true,
    },
    whiteBalance: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for whiteBalance',
      readOnly: true,
    },
    xResolution: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for xResolution',
      readOnly: true,
    },
    yCbCrPositioning: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for yCbCrPositioning',
      readOnly: true,
    },
    yResolution: {
      nullable: true,
      type: 'string',
      description: 'exif data extracted for yResolution',
      readOnly: true,
    },
  },
};

export const PostWithTags = {
  ...post,
  properties: {
    ...post.properties,
    [TAGS]: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Tag',
      },
    },
  },
};

export const PostPatch = {
  ...omit(post, 'required'),
};

export default post;
