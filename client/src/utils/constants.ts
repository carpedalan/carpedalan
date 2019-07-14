export const API_PATH = '/v1';
export const IMAGES_PATH = '/images';
export const API_IMAGES_PATH = `${API_PATH}${IMAGES_PATH}`;
export const DEFAULT_POSTS_PER_PAGE = 100;
export const CF_TIMEOUT = 1000 * 45;

export const PHOTOS = 'photos';
// columns for photos
export const APERTURE = 'aperture';
export const CAMERA = 'camera';
export const CREATEDAT = 'createdAt';
export const DATE = 'date';
export const DESCRIPTION = 'description';
export const ETAG = 'etag';
export const EXPOSURE = 'exposure';
export const FOCALLENGTH = 'focalLength';
export const HEIGHT = 'height';
export const ID = 'id';
export const ISO = 'ISO';
export const KEY = 'key';
export const ORIGINALURL = 'originalUrl';
export const TIMESTAMP = 'timestamp';
export const UPDATEDAT = 'updatedAt';
export const STATUS = 'status';
export const WIDTH = 'width';
export const SQIP = 'sqip';
export const EXIFPROPS = {
  ApertureValue: 'apertureValue',
  BrightnessValue: 'brightnessValue',
  ColorSpace: 'colorSpace',
  Contrast: 'contrast',
  CreateDate: 'createDate',
  CustomRendered: 'customRendered',
  DateTimeOriginal: 'dateTimeOriginal',
  DigitalZoomRatio: 'digitalZoomRatio',
  ExifImageHeight: 'exifImageHeight',
  ExifImageWidth: 'exifImageWidth',
  ExposureCompensation: 'exposureCompensation',
  ExposureMode: 'exposureMode',
  ExposureProgram: 'exposureProgram',
  ExposureTime: 'exposureTime',
  Flash: 'flash',
  FNumber: 'fNumber',
  FocalLength: 'focalLength',
  FocalLengthIn35mmFormat: 'focalLengthIn35mmFormat',
  GPSAltitude: 'gpsAltitude',
  GPSAltitudeRef: 'gpsAltitudeRef',
  GPSDateStamp: 'gpsDateStamp',
  GPSDOP: 'gpsDOP',
  GPSLatitude: 'gpsLatitude',
  GPSLatitudeRef: 'gpsLatitudeRef',
  GPSLongitude: 'gpsLongitude',
  GPSLongitudeRef: 'gpsLongitudeRef',
  GPSTimeStamp: 'gpsTimeStamp',
  GPSVersionID: 'gpsVersionID',
  ImageHeight: 'imageHeight',
  ImageWidth: 'imageWidth',
  InteropIndex: 'interopIndex',
  ISO: 'ISO',
  Make: 'make',
  MaxApertureValue: 'maxApertureValue',
  MeteringMode: 'meteringMode',
  Model: 'model',
  ModifyDate: 'modifyDate',
  Orientation: 'orientation',
  ResolutionUnit: 'resolutionUnit',
  Saturation: 'saturation',
  SceneCaptureType: 'sceneCaptureType',
  SensingMethod: 'sensingMethod',
  Sharpness: 'sharpness',
  ShutterSpeedValue: 'shutterSpeedValue',
  Software: 'software',
  SubjectDistance: 'subjectDistance',
  SubjectDistanceRange: 'subjectDistanceRange',
  SubSecTime: 'subSecTime',
  SubSecTimeDigitized: 'subSecTimeDigitized',
  SubSecTimeOriginal: 'subSecTimeOriginal',
  WhiteBalance: 'whiteBalance',
  XResolution: 'xResolution',
  YCbCrPositioning: 'yCbCrPositioning',
  YResolution: 'yResolution',
};

export const TAGS = 'tags';
// columns for tags
export const NAME = 'name';

export const PHOTOS_TAGS = 'photos_tags';
// columns for photos_tags
export const PHOTO_ID = 'photoId';
export const TAG_ID = 'tagId';

export const ADMIN = 'write';
export const READ_ONLY = 'read';

export const ACTIVE = 'active';
export const DELETED = 'deleted';
export const PENDING = 'pending';
export const IS_PENDING = 'isPending';

export const SIZES = [
  {
    width: 250,
  },
  {
    width: 500,
  },
  {
    width: 768,
  },
  {
    width: 1536,
  },
  {
    width: 250,
    height: 250,
  },
  {
    width: 100,
    height: 100,
  },
];

export const TINY = 'tiny';
export const SMALL = 'small';
export const MEDIUM = 'medium';
export const HIRES = 'hires';
export const LARGE_THUMB = 'large-thumb';
export const SMALL_THUMB = 'small-thumb';

export type Sizes =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'hires'
  | 'large-thumb'
  | 'small-thumb';

export const SIZE_MAP = {
  [TINY]: SIZES[0],
  [SMALL]: SIZES[1],
  [MEDIUM]: SIZES[2],
  [HIRES]: SIZES[3],
  [SMALL_THUMB]: SIZES[4],
  [LARGE_THUMB]: SIZES[5],
};

export default {
  ADMIN,
  READ_ONLY,
  API_IMAGES_PATH,
  API_PATH,
  IMAGES_PATH,
  APERTURE,
  CAMERA,
  CREATEDAT,
  DATE,
  DESCRIPTION,
  ETAG,
  EXPOSURE,
  FOCALLENGTH,
  HEIGHT,
  ID,
  ISO,
  KEY,
  ORIGINALURL,
  STATUS,
  TAGS,
  TIMESTAMP,
  UPDATEDAT,
  WIDTH,
  ACTIVE,
  DELETED,
  PHOTOS,
  NAME,
  PHOTOS_TAGS,
  PHOTO_ID,
  TAG_ID,
  SIZES,
  SIZE_MAP,
  SMALL,
  MEDIUM,
  HIRES,
  SMALL_THUMB,
  LARGE_THUMB,
  EXIFPROPS,
  SQIP,
  TINY,
  DEFAULT_POSTS_PER_PAGE,
  CF_TIMEOUT,
  PENDING,
  IS_PENDING,
};
