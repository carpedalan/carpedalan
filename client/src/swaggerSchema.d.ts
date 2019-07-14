declare namespace Components {
  namespace Schemas {
    export interface Error {
      /**
       * HTTP status code of response
       * example:
       * 420
       */
      status?: number;
      /**
       * Human readable explanation of error
       * example:
       * Oops, that's not right
       */
      message?: string;
      /**
       * Array of errors that provide explanation
       */
      errors?: {
        /**
         * Coded error type
         * example:
         * openapi.validation.error
         */
        type?: string;
        /**
         * Path of field or property that is in question
         * example:
         * name
         */
        path?: string;
        /**
         * Human readable error message
         * example:
         * request body should have x
         */
        message?: string;
      }[];
    }
    export interface Post {
      readonly id?: string; // uuid
      rotate?: '0' | '90' | '180' | '270';
      /**
       * Integer unix epoch timestamp
       */
      timestamp?: null | number;
      /**
       * Date time from legacy tumblr images
       */
      readonly date?: string | null; // date-time
      /**
       * Original URL from legacy tumblr images
       */
      readonly originalUrl?: string | null; // uri
      /**
       * Descrtipion/caption for the post
       * example:
       * a description
       */
      description?: string | null;
      /**
       * example:
       * something.jpg
       */
      key: string; // .jpg$
      /**
       * example:
       * active
       */
      readonly status?: 'active' | 'deleted';
      readonly createdAt?: string; // date-time
      readonly updatedAt?: string; // date-time
      isPending?: boolean;
      tags?: string /* uuid */[];
      etag?: string | null;
      /**
       * exif data extracted
       */
      readonly apertureValue?: string | null;
      /**
       * exif data brightnessValue
       */
      readonly brightnessValue?: string | null;
      /**
       * exif data colorSpace
       */
      readonly colorSpace?: string | null;
      /**
       * exif data contrast
       */
      readonly contrast?: string | null;
      /**
       * exif data createDate
       */
      readonly createDate?: string | null;
      /**
       * exif data customRendered
       */
      readonly customRendered?: string | null;
      /**
       * exif data dateTimeOriginal
       */
      readonly dateTimeOriginal?: string | null;
      /**
       * exif data digitalZoomRatio
       */
      readonly digitalZoomRatio?: string | null;
      /**
       * exif data exifImageHeight
       */
      readonly exifImageHeight?: string | null;
      /**
       * exif data exifImageWidth
       */
      readonly exifImageWidth?: string | null;
      /**
       * exif data exposureCompensation
       */
      readonly exposureCompensation?: string | null;
      /**
       * exif data exposureMode
       */
      readonly exposureMode?: string | null;
      /**
       * exif data exposureProgram
       */
      readonly exposureProgram?: string | null;
      /**
       * exif data exposureTime
       */
      readonly exposureTime?: string | null;
      /**
       * exif data flash
       */
      readonly flash?: string | null;
      /**
       * exif data fNumber
       */
      readonly fNumber?: string | null;
      /**
       * exif data focalLength
       */
      readonly focalLength?: string | null;
      /**
       * exif data focalLengthIn35mmFormat
       */
      readonly focalLengthIn35mmFormat?: string | null;
      /**
       * exif data gpsAltitude
       */
      readonly gpsAltitude?: string | null;
      /**
       * exif data gpsAltitudeRef
       */
      readonly gpsAltitudeRef?: string | null;
      /**
       * exif data gpsDateStamp
       */
      readonly gpsDateStamp?: string | null;
      /**
       * exif data gpsDOP
       */
      readonly gpsDOP?: string | null;
      /**
       * exif data gpsLatitude
       */
      readonly gpsLatitude?: string | null;
      /**
       * exif data gpsLatitudeRef
       */
      readonly gpsLatitudeRef?: string | null;
      /**
       * exif data gpsLongitude
       */
      readonly gpsLongitude?: string | null;
      /**
       * exif data gpsLongitudeRef
       */
      readonly gpsLongitudeRef?: string | null;
      /**
       * exif data gpsTimeStamp
       */
      readonly gpsTimeStamp?: string | null;
      /**
       * exif data gpsVersionID
       */
      readonly gpsVersionID?: string | null;
      /**
       * exif data extracted for imageHeight
       */
      readonly imageHeight?: string | null;
      /**
       * exif data extracted for imageWidth
       */
      readonly imageWidth?: string | null;
      /**
       * exif data extracted for interopIndex
       */
      readonly interopIndex?: string | null;
      /**
       * exif data extracted for ISO
       */
      readonly ISO?: string | null;
      /**
       * exif data extracted for make
       */
      readonly make?: string | null;
      /**
       * exif data extracted for maxApertureValue
       */
      readonly maxApertureValue?: string | null;
      /**
       * exif data extracted for meteringMode
       */
      readonly meteringMode?: string | null;
      /**
       * exif data extracted for model
       */
      readonly model?: string | null;
      /**
       * exif data extracted for modifyDate
       */
      readonly modifyDate?: string | null;
      /**
       * exif data extracted for orientation
       */
      orientation?: string | null;
      /**
       * exif data extracted for resolutionUnit
       */
      readonly resolutionUnit?: string | null;
      /**
       * exif data extracted for saturation
       */
      readonly saturation?: string | null;
      /**
       * exif data extracted for sceneCaptureType
       */
      readonly sceneCaptureType?: string | null;
      /**
       * exif data extracted for sensingMethod
       */
      readonly sensingMethod?: string | null;
      /**
       * exif data extracted for sharpness
       */
      readonly sharpness?: string | null;
      /**
       * exif data extracted for shutterSpeedValue
       */
      readonly shutterSpeedValue?: string | null;
      /**
       * exif data extracted for software
       */
      readonly software?: string | null;
      /**
       * exif data extracted for subjectDistance
       */
      readonly subjectDistance?: string | null;
      /**
       * exif data extracted for subjectDistanceRange
       */
      readonly subjectDistanceRange?: string | null;
      /**
       * exif data extracted for subSecTime
       */
      readonly subSecTime?: string | null;
      /**
       * exif data extracted for subSecTimeDigitized
       */
      readonly subSecTimeDigitized?: string | null;
      /**
       * exif data extracted for subSecTimeOriginal
       */
      readonly subSecTimeOriginal?: string | null;
      /**
       * exif data extracted for whiteBalance
       */
      readonly whiteBalance?: string | null;
      /**
       * exif data extracted for xResolution
       */
      readonly xResolution?: string | null;
      /**
       * exif data extracted for yCbCrPositioning
       */
      readonly yCbCrPositioning?: string | null;
      /**
       * exif data extracted for yResolution
       */
      readonly yResolution?: string | null;
    }
    export interface PostList {
      /**
       * Array of posts
       */
      data: PostWithTags[];
      /**
       * Meta data about list and collection
       */
      meta: {
        /**
         * Total number in collection
         */
        count: number;
        /**
         * Current page
         */
        page: number;
        /**
         * Total number of pages
         */
        pages: number;
      };
    }
    export interface PostPatch {
      readonly id?: string; // uuid
      rotate?: '0' | '90' | '180' | '270';
      /**
       * Integer unix epoch timestamp
       */
      timestamp?: null | number;
      /**
       * Date time from legacy tumblr images
       */
      readonly date?: string | null; // date-time
      /**
       * Original URL from legacy tumblr images
       */
      readonly originalUrl?: string | null; // uri
      /**
       * Descrtipion/caption for the post
       * example:
       * a description
       */
      description?: string | null;
      /**
       * example:
       * something.jpg
       */
      key?: string; // .jpg$
      /**
       * example:
       * active
       */
      readonly status?: 'active' | 'deleted';
      readonly createdAt?: string; // date-time
      readonly updatedAt?: string; // date-time
      isPending?: boolean;
      tags?: string /* uuid */[];
      etag?: string | null;
      /**
       * exif data extracted
       */
      readonly apertureValue?: string | null;
      /**
       * exif data brightnessValue
       */
      readonly brightnessValue?: string | null;
      /**
       * exif data colorSpace
       */
      readonly colorSpace?: string | null;
      /**
       * exif data contrast
       */
      readonly contrast?: string | null;
      /**
       * exif data createDate
       */
      readonly createDate?: string | null;
      /**
       * exif data customRendered
       */
      readonly customRendered?: string | null;
      /**
       * exif data dateTimeOriginal
       */
      readonly dateTimeOriginal?: string | null;
      /**
       * exif data digitalZoomRatio
       */
      readonly digitalZoomRatio?: string | null;
      /**
       * exif data exifImageHeight
       */
      readonly exifImageHeight?: string | null;
      /**
       * exif data exifImageWidth
       */
      readonly exifImageWidth?: string | null;
      /**
       * exif data exposureCompensation
       */
      readonly exposureCompensation?: string | null;
      /**
       * exif data exposureMode
       */
      readonly exposureMode?: string | null;
      /**
       * exif data exposureProgram
       */
      readonly exposureProgram?: string | null;
      /**
       * exif data exposureTime
       */
      readonly exposureTime?: string | null;
      /**
       * exif data flash
       */
      readonly flash?: string | null;
      /**
       * exif data fNumber
       */
      readonly fNumber?: string | null;
      /**
       * exif data focalLength
       */
      readonly focalLength?: string | null;
      /**
       * exif data focalLengthIn35mmFormat
       */
      readonly focalLengthIn35mmFormat?: string | null;
      /**
       * exif data gpsAltitude
       */
      readonly gpsAltitude?: string | null;
      /**
       * exif data gpsAltitudeRef
       */
      readonly gpsAltitudeRef?: string | null;
      /**
       * exif data gpsDateStamp
       */
      readonly gpsDateStamp?: string | null;
      /**
       * exif data gpsDOP
       */
      readonly gpsDOP?: string | null;
      /**
       * exif data gpsLatitude
       */
      readonly gpsLatitude?: string | null;
      /**
       * exif data gpsLatitudeRef
       */
      readonly gpsLatitudeRef?: string | null;
      /**
       * exif data gpsLongitude
       */
      readonly gpsLongitude?: string | null;
      /**
       * exif data gpsLongitudeRef
       */
      readonly gpsLongitudeRef?: string | null;
      /**
       * exif data gpsTimeStamp
       */
      readonly gpsTimeStamp?: string | null;
      /**
       * exif data gpsVersionID
       */
      readonly gpsVersionID?: string | null;
      /**
       * exif data extracted for imageHeight
       */
      readonly imageHeight?: string | null;
      /**
       * exif data extracted for imageWidth
       */
      readonly imageWidth?: string | null;
      /**
       * exif data extracted for interopIndex
       */
      readonly interopIndex?: string | null;
      /**
       * exif data extracted for ISO
       */
      readonly ISO?: string | null;
      /**
       * exif data extracted for make
       */
      readonly make?: string | null;
      /**
       * exif data extracted for maxApertureValue
       */
      readonly maxApertureValue?: string | null;
      /**
       * exif data extracted for meteringMode
       */
      readonly meteringMode?: string | null;
      /**
       * exif data extracted for model
       */
      readonly model?: string | null;
      /**
       * exif data extracted for modifyDate
       */
      readonly modifyDate?: string | null;
      /**
       * exif data extracted for orientation
       */
      orientation?: string | null;
      /**
       * exif data extracted for resolutionUnit
       */
      readonly resolutionUnit?: string | null;
      /**
       * exif data extracted for saturation
       */
      readonly saturation?: string | null;
      /**
       * exif data extracted for sceneCaptureType
       */
      readonly sceneCaptureType?: string | null;
      /**
       * exif data extracted for sensingMethod
       */
      readonly sensingMethod?: string | null;
      /**
       * exif data extracted for sharpness
       */
      readonly sharpness?: string | null;
      /**
       * exif data extracted for shutterSpeedValue
       */
      readonly shutterSpeedValue?: string | null;
      /**
       * exif data extracted for software
       */
      readonly software?: string | null;
      /**
       * exif data extracted for subjectDistance
       */
      readonly subjectDistance?: string | null;
      /**
       * exif data extracted for subjectDistanceRange
       */
      readonly subjectDistanceRange?: string | null;
      /**
       * exif data extracted for subSecTime
       */
      readonly subSecTime?: string | null;
      /**
       * exif data extracted for subSecTimeDigitized
       */
      readonly subSecTimeDigitized?: string | null;
      /**
       * exif data extracted for subSecTimeOriginal
       */
      readonly subSecTimeOriginal?: string | null;
      /**
       * exif data extracted for whiteBalance
       */
      readonly whiteBalance?: string | null;
      /**
       * exif data extracted for xResolution
       */
      readonly xResolution?: string | null;
      /**
       * exif data extracted for yCbCrPositioning
       */
      readonly yCbCrPositioning?: string | null;
      /**
       * exif data extracted for yResolution
       */
      readonly yResolution?: string | null;
    }
    export interface PostWithTags {
      readonly id?: string; // uuid
      rotate?: '0' | '90' | '180' | '270';
      /**
       * Integer unix epoch timestamp
       */
      timestamp?: null | number;
      /**
       * Date time from legacy tumblr images
       */
      readonly date?: string | null; // date-time
      /**
       * Original URL from legacy tumblr images
       */
      readonly originalUrl?: string | null; // uri
      /**
       * Descrtipion/caption for the post
       * example:
       * a description
       */
      description?: string | null;
      /**
       * example:
       * something.jpg
       */
      key: string; // .jpg$
      /**
       * example:
       * active
       */
      readonly status?: 'active' | 'deleted';
      readonly createdAt?: string; // date-time
      readonly updatedAt?: string; // date-time
      isPending?: boolean;
      tags?: Tag[];
      etag?: string | null;
      /**
       * exif data extracted
       */
      readonly apertureValue?: string | null;
      /**
       * exif data brightnessValue
       */
      readonly brightnessValue?: string | null;
      /**
       * exif data colorSpace
       */
      readonly colorSpace?: string | null;
      /**
       * exif data contrast
       */
      readonly contrast?: string | null;
      /**
       * exif data createDate
       */
      readonly createDate?: string | null;
      /**
       * exif data customRendered
       */
      readonly customRendered?: string | null;
      /**
       * exif data dateTimeOriginal
       */
      readonly dateTimeOriginal?: string | null;
      /**
       * exif data digitalZoomRatio
       */
      readonly digitalZoomRatio?: string | null;
      /**
       * exif data exifImageHeight
       */
      readonly exifImageHeight?: string | null;
      /**
       * exif data exifImageWidth
       */
      readonly exifImageWidth?: string | null;
      /**
       * exif data exposureCompensation
       */
      readonly exposureCompensation?: string | null;
      /**
       * exif data exposureMode
       */
      readonly exposureMode?: string | null;
      /**
       * exif data exposureProgram
       */
      readonly exposureProgram?: string | null;
      /**
       * exif data exposureTime
       */
      readonly exposureTime?: string | null;
      /**
       * exif data flash
       */
      readonly flash?: string | null;
      /**
       * exif data fNumber
       */
      readonly fNumber?: string | null;
      /**
       * exif data focalLength
       */
      readonly focalLength?: string | null;
      /**
       * exif data focalLengthIn35mmFormat
       */
      readonly focalLengthIn35mmFormat?: string | null;
      /**
       * exif data gpsAltitude
       */
      readonly gpsAltitude?: string | null;
      /**
       * exif data gpsAltitudeRef
       */
      readonly gpsAltitudeRef?: string | null;
      /**
       * exif data gpsDateStamp
       */
      readonly gpsDateStamp?: string | null;
      /**
       * exif data gpsDOP
       */
      readonly gpsDOP?: string | null;
      /**
       * exif data gpsLatitude
       */
      readonly gpsLatitude?: string | null;
      /**
       * exif data gpsLatitudeRef
       */
      readonly gpsLatitudeRef?: string | null;
      /**
       * exif data gpsLongitude
       */
      readonly gpsLongitude?: string | null;
      /**
       * exif data gpsLongitudeRef
       */
      readonly gpsLongitudeRef?: string | null;
      /**
       * exif data gpsTimeStamp
       */
      readonly gpsTimeStamp?: string | null;
      /**
       * exif data gpsVersionID
       */
      readonly gpsVersionID?: string | null;
      /**
       * exif data extracted for imageHeight
       */
      readonly imageHeight?: string | null;
      /**
       * exif data extracted for imageWidth
       */
      readonly imageWidth?: string | null;
      /**
       * exif data extracted for interopIndex
       */
      readonly interopIndex?: string | null;
      /**
       * exif data extracted for ISO
       */
      readonly ISO?: string | null;
      /**
       * exif data extracted for make
       */
      readonly make?: string | null;
      /**
       * exif data extracted for maxApertureValue
       */
      readonly maxApertureValue?: string | null;
      /**
       * exif data extracted for meteringMode
       */
      readonly meteringMode?: string | null;
      /**
       * exif data extracted for model
       */
      readonly model?: string | null;
      /**
       * exif data extracted for modifyDate
       */
      readonly modifyDate?: string | null;
      /**
       * exif data extracted for orientation
       */
      orientation?: string | null;
      /**
       * exif data extracted for resolutionUnit
       */
      readonly resolutionUnit?: string | null;
      /**
       * exif data extracted for saturation
       */
      readonly saturation?: string | null;
      /**
       * exif data extracted for sceneCaptureType
       */
      readonly sceneCaptureType?: string | null;
      /**
       * exif data extracted for sensingMethod
       */
      readonly sensingMethod?: string | null;
      /**
       * exif data extracted for sharpness
       */
      readonly sharpness?: string | null;
      /**
       * exif data extracted for shutterSpeedValue
       */
      readonly shutterSpeedValue?: string | null;
      /**
       * exif data extracted for software
       */
      readonly software?: string | null;
      /**
       * exif data extracted for subjectDistance
       */
      readonly subjectDistance?: string | null;
      /**
       * exif data extracted for subjectDistanceRange
       */
      readonly subjectDistanceRange?: string | null;
      /**
       * exif data extracted for subSecTime
       */
      readonly subSecTime?: string | null;
      /**
       * exif data extracted for subSecTimeDigitized
       */
      readonly subSecTimeDigitized?: string | null;
      /**
       * exif data extracted for subSecTimeOriginal
       */
      readonly subSecTimeOriginal?: string | null;
      /**
       * exif data extracted for whiteBalance
       */
      readonly whiteBalance?: string | null;
      /**
       * exif data extracted for xResolution
       */
      readonly xResolution?: string | null;
      /**
       * exif data extracted for yCbCrPositioning
       */
      readonly yCbCrPositioning?: string | null;
      /**
       * exif data extracted for yResolution
       */
      readonly yResolution?: string | null;
    }
    /**
     * Tag entity
     */
    export interface Tag {
      /**
       * uuid of tag record
       */
      id?: string; // uuid
      /**
       * Name of tag
       */
      name?: string;
    }
  }
}
declare namespace Paths {
  namespace CreatePost {
    export type RequestBody = Components.Schemas.Post;
    namespace Responses {
      export type $201 = Components.Schemas.Post;
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace DelPost {
    namespace Parameters {
      /**
       * uuid of post
       */
      export type Id = string; // uuid
    }
    export interface PathParameters {
      id: Parameters.Id; // uuid
    }
    namespace Responses {
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace DeleteBulkPosts {
    export interface RequestBody {
      /**
       * Array of ids to delete
       */
      ids: string /* uuid */[];
    }
    namespace Responses {
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace GetPost {
    namespace Parameters {
      /**
       * uuid of post record to retrieve
       */
      export type Id = string; // uuid
    }
    export interface PathParameters {
      id: Parameters.Id; // uuid
    }
    namespace Responses {
      export type $200 = Components.Schemas.PostWithTags;
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace GetPosts {
    namespace Parameters {
      export type Fields = (
        | 'id'
        | 'timestamp'
        | 'date'
        | 'originalUrl'
        | 'description'
        | 'etag'
        | 'key'
        | 'createdAt'
        | 'updatedAt'
        | 'status'
        | 'apertureValue'
        | 'brightnessValue'
        | 'colorSpace'
        | 'contrast'
        | 'createDate'
        | 'customRendered'
        | 'dateTimeOriginal'
        | 'digitalZoomRatio'
        | 'exifImageHeight'
        | 'exifImageWidth'
        | 'exposureCompensation'
        | 'exposureMode'
        | 'exposureProgram'
        | 'exposureTime'
        | 'flash'
        | 'fNumber'
        | 'focalLength'
        | 'focalLengthIn35mmFormat'
        | 'gpsAltitude'
        | 'gpsAltitudeRef'
        | 'gpsDateStamp'
        | 'gpsDOP'
        | 'gpsLatitude'
        | 'gpsLatitudeRef'
        | 'gpsLongitude'
        | 'gpsLongitudeRef'
        | 'gpsTimeStamp'
        | 'gpsVersionID'
        | 'imageHeight'
        | 'imageWidth'
        | 'interopIndex'
        | 'ISO'
        | 'make'
        | 'maxApertureValue'
        | 'meteringMode'
        | 'model'
        | 'modifyDate'
        | 'orientation'
        | 'resolutionUnit'
        | 'saturation'
        | 'sceneCaptureType'
        | 'sensingMethod'
        | 'sharpness'
        | 'shutterSpeedValue'
        | 'software'
        | 'subjectDistance'
        | 'subjectDistanceRange'
        | 'subSecTime'
        | 'subSecTimeDigitized'
        | 'subSecTimeOriginal'
        | 'whiteBalance'
        | 'xResolution'
        | 'yCbCrPositioning'
        | 'yResolution')[];
      export type IsPending = boolean;
      /**
       * Order of query of posts
       */
      export type Order = 'asc' | 'desc';
      export type Page = number;
    }
    export interface QueryParameters {
      order?: Parameters.Order;
      page?: Parameters.Page;
      isPending?: Parameters.IsPending;
      fields?: Parameters.Fields;
    }
    namespace Responses {
      export type $200 = Components.Schemas.PostList;
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace GetPostsByTag {
    namespace Parameters {
      /**
       * uuid of tag that all posts are associated with
       * example:
       * 0f634edd-e401-4d6a-b5b2-9ae32dffa871
       */
      export type TagId = string; // uuid
    }
    export interface PathParameters {
      tagId: Parameters.TagId; // uuid
    }
    namespace Responses {
      export type $200 = Components.Schemas.PostList;
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace GetTags {
    namespace Responses {
      /**
       * An array of tag objects
       */
      export type $200 = {
        /**
         * Name of tag
         */
        name?: string;
        /**
         * uuid of tag
         */
        id?: string; // uuid
        /**
         * Number of associations currently with tag
         */
        count?: number;
      }[];
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace Invitation {
    /**
     * Payload for invitation
     */
    export interface RequestBody {
      /**
       * Name
       * example:
       * Jay Inslee
       */
      name: string;
      /**
       * E-mail
       */
      email: string; // email
    }
    namespace Responses {
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace Login {
    /**
     * Object with password property
     */
    export interface RequestBody {
      /**
       * password
       */
      password: string; // password
    }
    namespace Responses {
      /**
       * Result of logging in
       */
      export interface $200 {
        /**
         * Role of user
         */
        user?: 'read' | 'write';
      }
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace Logout {
    namespace Responses {
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace PatchPost {
    namespace Parameters {
      export type Id = string; // uuid
    }
    export interface PathParameters {
      id: Parameters.Id; // uuid
    }
    export type RequestBody = Components.Schemas.PostPatch;
    namespace Responses {
      export type $200 = Components.Schemas.PostWithTags;
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace PostPosts {
    /**
     * Object containing bulk patch request
     */
    export interface RequestBody {
      /**
       * Array of post ids affected by request
       */
      ids: string /* uuid */[];
      /**
       * array of ids to ADD to all post ids
       */
      tags?: string /* uuid */[];
      /**
       * Descrtiption to update for all post ids
       */
      description?: string;
    }
    namespace Responses {
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace PostTags {
    export interface RequestBody {
      /**
       * Name of the new tag
       * example:
       * some tag
       */
      name: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.Tag;
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace Refresh {
    namespace Responses {
      export interface $200 {
        /**
         * Acknoweldgement that the user has been refreshed
         * example:
         * true
         */
        refreshed?: boolean;
      }
      export type $401 = Components.Schemas.Error;
    }
  }
  namespace SetUser {
    export interface RequestBody {
      /**
       * How many times the user has requested a login
       * example:
       * 1
       */
      requests?: number;
    }
    namespace Responses {
      /**
       * Result of logging in
       */
      export interface $200 {
        /**
         * Role of user
         */
        user?: string;
        /**
         * Number of requests
         * example:
         * 1
         */
        requests?: number;
      }
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
  namespace Upload {
    namespace Parameters {
      /**
       * example:
       * somepicture.jpg
       */
      export type Name = string;
    }
    export interface QueryParameters {
      name: Parameters.Name;
    }
    namespace Responses {
      export interface $201 {
        /**
         * example:
         * https://carpedev-west.s3.amazonaws.com
         */
        upload_url?: string; // uri
        params?: {
          /**
           * Key the file was uploaded to
           */
          key?: string;
          /**
           * ACL of the object uploaded
           * example:
           * public-read
           */
          acl?: string;
          /**
           * Internal service code requested
           * example:
           * 201
           */
          success_action_status?: string;
          /**
           * Policy required in the header for the multipart file upload
           * example:
           * eyJleHBpcmF0aW9uIjoiMjAxOS0wMi0yNFQyMTo1MjowOC42MzFaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoiY2FycGVkZXYtd2VzdCJ9LHsia2V5IjoicmF3L3VuZGVmaW5lZCJ9LHsiYWNsIjoicHVibGljLXJlYWQifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTAwMDAwMDBdLHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFJUDNGUzRJUExQMkhOUkVRLzIwMTkwMjI0L3VzLXdlc3QtMi9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWRhdGUiOiIyMDE5MDIyNFQwMDAwMDBaIn1dfQ==
           */
          policy?: string;
          /**
           * Meta data about the signed upload policy
           * example:
           * AWS4-HMAC-SHA256
           */
          'x-amz-algorithm'?: string;
          /**
           * Meta data about the signed upload policy
           * example:
           * AKIAIP3FS4IPLP2HNREQ/20190225/us-west-2/s3/aws4_request
           */
          'x-amz-credential'?: string;
          /**
           * Meta data about the signed upload policy
           * example:
           * 20190225T000000Z
           */
          'x-amz-date'?: string;
          /**
           * Meta data about the signed upload policy
           * example:
           * 31886490662a565f35c2690a64b469dfa7fdea5985cad6b2bf55cd140981cb04
           */
          'x-amz-signature'?: string;
        };
      }
      export type $400 = Components.Schemas.Error;
      export type $401 = Components.Schemas.Error;
      export type $403 = Components.Schemas.Error;
      export type $404 = Components.Schemas.Error;
      export type $422 = Components.Schemas.Error;
      export type $500 = Components.Schemas.Error;
    }
  }
}
