declare namespace tt {
  const env: {
    readonly USER_DATA_PATH: string;
    readonly VERSION: "development" | "preview" | "production";
  };

  interface StandReturn {
    errMsg: string;
  }
  interface StandParam<
    R = { [proName: string]: any },
    E = { [proName: string]: any }
  > {
    success?(res: StandReturn & R): void;
    fail?(res: StandReturn & E): void;
    complete?(res: StandReturn): void;
  }
  interface ToTempFilePathParam {
    /**
     * - 截取 canvas 的左上角横坐标
     * - 默认值: 0
     */
    x?: number;
    /**
     * - 截取 canvas 的左上角纵坐标
     * - 默认值: 0
     */
    y?: number;
    /**
     * - 截取 canvas 的宽度
     * - 默认值: canvas 的宽度
     */
    width?: number;
    /**
     * - 截取 canvas 的高度
     * - 默认值: canvas 的高度
     */
    height?: number;
    /**
     * - 目标文件的宽度, 会将截取的部分拉伸或压缩至该数值
     * - 默认值: canvas 的宽度
     */
    destWidth?: number;
    /**
     * - 目标文件的高度, 会将截取的部分拉伸或压缩至该数值
     * - 默认值: canvas 的高度
     */
    destHeight?: number;
    /**
     * - 目标文件的类型
     * - 默认值: "png"
     */
    fileType?: string;
    /**
     * - jpg图片的质量, 仅当 fileType 为 jpg 时有效. 取值范围为 0.0(最低)- 1.0(最高), 不含 0. 不在范围内时当作 1.0
     * - (默认值: 1.0)
     */
    quality?: number;
  }

  /**
   * 画图
   */
  interface Canvas {
    getContext(
      contextType: "2d"
    ): Omit<
      CanvasRenderingContext2D,
      "clip" | "lineDashOffset" | "isPointInPath" | "isPointInStroke"
    >;
    getContext(contextType: "webgl"): WebGLRenderingContext;
    toTempFilePath(
      param: StandParam<{ tempFilePath: string }> & ToTempFilePathParam
    ): void;
    toTempFilePathSync(param: ToTempFilePathParam): string;
    toDataURL(): string;
    dispose(): void;
    width: number;
    height: number;
  }
  function createCanvas(): Canvas;

  /***
   * 字体
   */
  function loadFont(path: string): string | null;

  /**
   * 帧率
   *
   */
  function setPreferredFramesPerSecond(fps: number): void;
  /**
   * 图片
   */
  interface Image {
    src: string;
    width: number;
    height: number;
    addEventListener(event: string, handle: CallableFunction): void;
  }
  function createImage(): Image;

  /***
   *  加速度计
   */
  function startAccelerometer(param?: StandParam): void;
  function stopAccelerometer(param?: StandParam): void;
  function onAccelerometerChange(
    handler: (data: { x: number; y: number; z: number }) => void
  ): void;
  /**
   * 剪贴板
   */
  function setClipboardData(param: StandParam & { data: string }): void;
  function getClipboardData(param: StandParam<{ data: string }>): void;
  /**
   *
   * 罗盘
   */
  function startCompass(param: StandParam & { data: string }): void;
  function stopCompass(param: StandParam & { data: string }): void;
  function onCompassChange(
    handler: (data: { direction: number }) => void
  ): void;

  /**
   * 网络
   * */
  type NetworkType = "none" | "wifi" | "2g" | "3g" | "4g" | "unknown";
  function getNetworkType(
    param: StandParam<{ networkType: NetworkType }>
  ): void;
  function onNetworkStatusChange(
    handler: (data: { networkType: NetworkType }) => void
  ): void;
  /**
   * 屏幕亮度
   *
   */
  function setKeepScreenOn(param: StandParam & { keepScreenOn: boolean }): void;
  /**
   * 振动
   */
  function vibrateLong(param?: StandParam): void;
  function vibrateShort(param?: StandParam): void;
  /**
   * 电池
   */
  function getBatteryInfo(
    param?: StandParam<{ level: string; isCharging: boolean }>
  ): void;
  function getBatteryInfoSync(): { level: string; isCharging: boolean };
  /**
   * 文件
   */
  interface FileInst {
    filePath: string; // 本地路径
    size: number; // 本地文件大小, 以字节为单位
    createTime: number; // 文件创建时间
  }
  interface Stats {
    mode: string;
    size: number;
    lastAccessedTime: number;
    lastModifiedTime: number;
    isDirectory(): boolean;
    isFile(): boolean;
  }
  type Encoding =
    | "ascii"
    | "base64"
    | "binary"
    | "hex"
    | "ucs2"
    | "ucs-2"
    | "utf16le"
    | "utf-16le"
    | "utf-8"
    | "utf8"
    | "latin1";

  interface FileSystemManager {
    access(param: StandParam & { path: string }): void;
    accessSync(path: string): void;
    copyFile(param: StandParam & { srcPath: string; destPath: string }): void;
    copyFileSync(srcPath: string, destPath: string): void;
    getFileInfo(
      param: StandParam<{ size: number }> & { filePath: string }
    ): void;
    getSavedFileList(param: StandParam<{ fileList: FileInst[] }>): void;
    mkdir(param: StandParam & { dirPath: string }): void;
    mkdirSync(dirPath: string): void;
    readFile(
      param: StandParam<{ data: string | ArrayBuffer }> & {
        filePath: string;
        encoding?: Encoding;
      }
    ): void;
    readFileSync(filePath: string, encoding?: Encoding): string | ArrayBuffer;
    readdir(param: StandParam<{ files: string[] }> & { dirPath: string }): void;
    readdirSync(dirPath: string): string[];
    removeSavedFile(param: StandParam & { filePath: string }): void;
    rename(param: StandParam & { oldPath: string; newPath: string }): void;
    renameSync(oldPath: string, newPath: string): void;
    rmdir(param: StandParam & { dirPath: string }): void;
    rmdirSync(dirPath: string): void;
    saveFile(
      param: StandParam<{ savedFilePath: string }> & {
        tempFilePath: string;
        filePath?: string;
      }
    ): void;
    saveFileSync(tempFilePath: string, filePath?: string): string;
    unlink(param: StandParam & { filePath: string }): void;
    unlinkSync(filePath: string): void;
    unzip(
      param: StandParam & { zipFilePath: string; targetPath: string }
    ): void;
    writeFile(
      param: StandParam & {
        filePath: string;
        data: string | ArrayBuffer;
        encoding: Encoding;
      }
    ): void;
    writeFileSync(
      filePath: string,
      data: string | ArrayBuffer,
      encoding: Encoding
    ): void;
    stat(param: StandParam<{ stat: Stats }> & { path: string }): void;
    statSync(path: string): Stats;
  }

  function getFileSystemManager(): FileSystemManager;

  /**
   * 位置
   */
  interface Location {
    /** 纬度, 范围为 -90~90, 负数表示南纬 */
    latitude: number;
    /** 经度, 范围为 -180~180, 负数表示西经 */
    longitude: number;
    /** 速度, 单位 m/s */
    speed: number;
    /**垂直精度 */
    verticalAccuracy: number;
    /**水平精度 */
    horizontalAccuracy: number;
    /** 位置的精确度 */
    accuracy: number;
    /** 高度, 单位 m */
    altitude: number;
    /** 定位到的城市信息*/
    city: string; // ios不支持
  }

  function getLocation(
    param: StandParam<Location> & {
      type?: "wgs84" | "gps" | "gcj02";
    }
  ): void;

  /***
   * 音频
   */
  interface InnerAudioContext {
    /** 音频资源的地址 */
    src: string;
    /** 是否自动播放 */
    autoplay: boolean;
    /** 是否循环播放 */
    loop: boolean;
    /** 是否遵循系统静音开关, 当此参数为 false 时, 即使用户打开了静音开关, 也能继续发出声音 */
    obeyMuteSwitch: boolean;
    /** 当前音频的长度, 单位 s.只有在当前有合法的 src 时返回 */
    duration: number;
    /** 当前音频的播放位置, 单位 s.只有在当前有合法的 src 时返回, 时间不取整, 保留小数点后 6 位 */
    currentTime: number;
    /** 当前是是否暂停或停止状态, true 表示暂停或停止, false 表示正在播放 */
    paused: boolean;
    /** 音频缓冲的时间点, 仅保证当前播放时间点到此时间点内容已缓冲 */
    buffered: number;
    /** 音量.范围 0~1. */
    volume: number;
    /** 播放 */
    play(): void;
    /** 暂停.暂停后的音频再播放会从暂停处开始播放 */
    pause(): void;
    /** 停止.停止后的音频再播放会从头开始播放. */
    stop(): void;
    /** 跳转到指定位置, 单位 s */
    seek(position: number): void;
    /** 销毁当前实例 */
    destroy(): void;
    /** 监听音频进入可以播放状态的事件 */
    onCanplay(handler: () => void): void;
    /** 监听音频播放事件 */
    onPlay(handler: () => void): void;
    /** 监听音频暂停事件 */
    onPause(handler: () => void): void;
    /** 监听音频停止事件 */
    onStop(handler: () => void): void;
    /** 监听音频自然播放至结束的事件 */
    onEnded(handler: () => void): void;
    /** 监听音频播放进度更新事件 */
    onTimeUpdate(handler: () => void): void;
    /** 监听音频播放错误事件 */
    onError(handler: (res: { errCode: number }) => void): void;
    /** 监听音频加载中事件, 当音频因为数据不足, 需要停下来加载时会触发 */
    onWaiting(handler: () => void): void;
    /** 监听音频进行跳转操作的事件 */
    onSeeking(handler: () => void): void;
    /** 监听音频完成跳转操作的事件 */
    onSeeked(handler: () => void): void;
    /** 取消监听音频进入可以播放状态的事件 */
    offCanplay(handler: () => void): void;
    /** 取消监听音频播放事件 */
    offPlay(handler: () => void): void;
    /** 取消监听音频暂停事件 */
    offPause(handler: () => void): void;
    /** 取消监听音频停止事件 */
    offStop(handler: () => void): void;
    /** 取消监听音频自然播放至结束的事件 */
    offEnded(handler: () => void): void;
    /** 取消监听音频播放进度更新事件 */
    offTimeUpdate(handler: () => void): void;
    /** 取消监听音频播放错误事件 */
    offError(handler: () => void): void;
    /** 取消监听音频加载中事件, 当音频因为数据不足, 需要停下来加载时会触发 */
    offWaiting(handler: () => void): void;
    /** 取消监听音频进行跳转操作的事件 */
    offSeeking(handler: () => void): void;
    /** 取消监听音频完成跳转操作的事件 */
    offSeeked(handler: () => void): void;
  }

  function createInnerAudioContext(): InnerAudioContext;

  interface ImageFile {
    path: string;
    size: number; // B
  }
  /**
   * 图片
   */
  function chooseImage(
    param: StandParam<{
      tempFilePaths: string[];
      tempFiles: ImageFile[];
    }> & {
      count: number;
      sizeType: ("original" | "compressed")[];
      sourceType: ("album" | "camera")[];
    }
  ): void;
  function saveImageToPhotosAlbum(
    param: StandParam & { filePath: string }
  ): void;
  function previewImage(
    param: StandParam & { urls: string[]; current?: string }
  ): void;
  function getImageInfo(
    param: StandParam<{
      width: number;
      height: number;
      type: string;
    }> & { src: string }
  ): void;
  function compressImage(
    params: StandParam<{
      tempFilePath: string;
    }> & {
      src: string;
      quality?: number;
    }
  ): void;

  /**
   * 录屏
   */
  interface GameRecorderManager {
    /** 开始录屏 */
    start(param: { duration: number }): void;
    /** 记录精彩时刻 */
    pause(): void;
    /** 剪辑精彩时刻 */
    recordClip(param: StandParam & { timeRange?: Array<number> }): void;
    /** 暂停录屏 */
    clipVideo(
      param: StandParam & {
        path: string;
        timeRange?: Array<number>;
        clipRange?: Array<number>;
      }
    ): void;
    /** 继续录屏 */
    resume(): void;
    /** 停止录屏 */
    stop(): void;
    /** 监听录屏开始事件 */
    onStart(handler: (...args: any[]) => void): void;
    /** 监听录屏继续事件 */
    onResume(handler: () => void): void;
    /** 监听录屏暂停事件 */
    onPause(handler: () => void): void;
    /** 监听录屏错误事件 */
    onStop(handler: (res: { videoPath: string }) => void): void;
    /** 监听录屏中断开始 */
    onError(handler: (res: { errMsg: string }) => void): void;
    /** 监听录屏中断开始 */
    onInterruptionBegin(handler: () => void): void;
    /** 监听录屏中断结束 */
    onInterruptionEnd(handler: () => void): void;
  }
  function getGameRecorderManager(): GameRecorderManager;
  /**
   * 录音
   */
  interface RecorderManager {
    /**开始录音 */
    start: (params?: {
      duration?: number;
      sampleRate?: number;
      numberOfChannels?: number;
      encodeBitRate?: number;
      frameSize?: number;
    }) => void;
    /**暂停录音 */
    pause(): void;
    /**继续录音 */
    resume(): void;
    /**停止录音 */
    stop(): void;
    /**录音开始事件回调 */
    onStart(handler: () => void): void;
    /**录音暂停事件回调 */
    onPause(handler: () => void): void;
    /**录音继续事件的回调 */
    onResume(handler: () => void): void;
    /**录音停止事件回调 */
    onStop(handler: (res: { tempFilePath: string }) => void): void;
    /** 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件 */
    onFrameRecorded(
      handler: (res: { frameBuffer: ArrayBuffer; isLastFrame: boolean }) => void
    ): void;
    /** 录音错误事件回调 */
    onError(handler: (res: { errMsg: string }) => void): void;
  }
  function getRecorderManager(): RecorderManager;

  /**下载 */
  interface DownLoadProgressValue {
    /** 下载进度百分比 */
    progress: number;
    /** 已经下载的数据长度, 单位 Bytes */
    totalBytesWritten: number;
    /** 预期需要下载的数据总长度, 单位 Bytes */
    totalBytesExpectedToWrite: number;
  }

  /** 一个可以监听下载进度变化事件和取消下载的对象 */
  interface DownloadTask {
    /** 停止下载 */
    abort(): void;
    /** 监听下载进度变化事件 */
    onProgressUpdate(handler: (res: DownLoadProgressValue) => void): void;
  }

  /** 下载文件资源到本地, 客户端直接发起一个 HTTP GET 请求, 返回文件的本地文件路径. */
  function downloadFile(
    param: StandParam<{
      /** 临时文件路径.如果没传入 filePath 指定文件存储路径, 则下载后的文件会存储到一个临时文件 */
      tempFilePath?: string;
      /** 开发者服务器返回的 HTTP 状态码 */
      statusCode: number;
    }> & {
      url: string;
      header?: Record<string, string>;
      filePath?: string;
    }
  ): DownloadTask;

  /** 发起网络请求 */
  interface RequestTask {
    abort(): void;
  }

  function request(
    param: StandParam<{
      data: any;
      statusCode: number;
      header: Record<string, string>;
    }> & {
      /** 开发者服务器接口地址 */
      url: string;
      /** 请求的参数 */
      data?: string | Record<string, any> | null;
      /** 设置请求的 header, header 中不能设置 Referer */
      header?: Record<string, string>;
      /** HTTP 动词 */
      method?: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
      /** 返回的数据格式 */
      dataType?: "json" | string;
      /** 响应的数据类型 */
      responseType?: "arraybuffer" | "text";
    }
  ): RequestTask;

  /**
   * 上传
   */
  interface UploadProgressValue {
    /** 上传进度百分比 */
    progress: number;
    /** 已经上传的数据长度, 单位 Bytes */
    totalBytesSent: number;
    /** 预期需要上传的数据总长度, 单位 Bytes */
    totalBytesExpectedToSend: number;
  }
  interface UploadTask {
    /** 停止上传 */
    abort(): void;
    /** 监听上传 */
    onProgressUpdate(handler: (res: UploadProgressValue) => void): void;
  }

  /**
   * - 将本地资源上传到开发者服务器, 客户端发起一个 HTTPS POST 请求
   * - 其中 content-type 为 multipart/form-data
   * */
  export function uploadFile(
    param: StandParam<{
      /** 开发者服务器返回的数据 */
      data: string;
      /** 开发者服务器返回的 HTTP 状态码 */
      statusCode: number;
    }> & {
      /** 开发者服务器地址 */
      url: string;
      /** 要上传文件资源的路径 */
      filePath: string;
      /** 文件对应的 key, 开发者在服务端可以通过这个 key 获取文件的二进制内容 */
      name: string;
      /** HTTP 请求 Header, Header 中不能设置 Referer */
      header?: Record<string, string>;
      /** HTTP 请求中其他额外的 form data */
      formData?: any;
    }
  ): UploadTask;

  /**
   * websocket
   */
  interface SocketTask {
    /** 通过 WebSocket 连接发送数据  */
    send(param: StandParam & { data: string | ArrayBuffer }): void;
    /** 关闭 WebSocket 连接 */
    close(
      param: StandParam & {
        /** 一个数字值表示关闭连接的状态号, 表示连接被关闭的原因.如果这个参数没有被指定, 默认的取值是1000 (表示正常连接关闭) */
        code: number;
        /** 一个可读的字符串, 表示连接被关闭的原因.这个字符串必须是不长于123字节的UTF-8 文本(不是字符) */
        reason: string;
      }
    ): void;

    /** 监听WebSocket 连接打开事件 */
    onOpen(handler: (res: { header: Record<string, string> }) => void): void;
    /** 监听WebSocket 连接关闭事件 */
    onClose(handler: () => void): void;
    /** 监听WebSocket 错误事件 */
    onError(handler: (res: { errMsg: string }) => void): void;
    /** 监听WebSocket 接受到服务器的消息事件 */
    onMessage(handler: (res: { data: string | ArrayBuffer }) => void): void;
  }

  /** 创建一个 WebSocket 连接.最多同时存在 5 个 WebSocket 连接 */
  function connectSocket(
    param: StandParam & {
      /** 开发者服务器接口地址, 必须是 wss 协议, 且域名必须是后台配置的合法域名 */
      url: string;
      /** HTTP Header, Header 中不能设置 Referer */
      header: Record<string, string>;
      /** 子协议数组 */
      protocols: string[];
    }
  ): SocketTask;

  /**
   *
   * 转发
   */
  /** 显示当前页面的转发按钮 */
  function showShareMenu(
    param: StandParam & { withShareTicket: boolean }
  ): void;
  /** 隐藏转发按钮 */
  function hideShareMenu(param: StandParam & {}): void;
  function offShareAppMessage(handler: (...args: any[]) => void): void;
  function onShareAppMessage(
    handler: (res: {
      /** 转发内容类型 */
      channel?: string;
      /** 转发标题, 不传则默认使用当前小游戏的名称. */
      title?: string;
      /** 转发显示图片的链接, 可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径, 显示图片长宽比推荐 5:4 */
      imageUrl?: string;
      /** 查询字符串, 必须是 key1=val1&key2=val2 的格式.从这条转发消息进入后, 可通过 tt.getLaunchOptionsSync() 或 tt.onShow() 获取启动参数中的 query. */
      query?: string;
      extra?: {
        /** 视频地址 */
        videoPath: string;
        /** 视频话题(只在抖音可用) */
        videoTopics: string[];
        /** 是否分享为挑战视频(带秒玩入口) */
        createChallenge: boolean;
      };
    }) => void
  ): void;
  function shareAppMessage(
    param: StandParam & {
      /** 转发内容类型 */
      channel?: "article" | "video";
      /** 转发标题, 不传则默认使用当前小游戏的名称. */
      title?: string;
      /** 转发显示图片的链接, 可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径, 显示图片长宽比推荐 5:4 */
      imageUrl?: string;
      /** 查询字符串, 必须是 key1=val1&key2=val2 的格式.从这条转发消息进入后, 可通过 tt.getLaunchOptionsSync() 或 tt.onShow() 获取启动参数中的 query. */
      query?: string;
      extra?: {
        /** 视频地址 */
        videoPath?: string;
        /** 视频话题(只在抖音可用) */
        videoTopic?: any[];
        /** false 是否分享为挑战视频(带秒玩入口) */
        createChallenge?: boolean;
        [key: string]: any;
      };
    }
  ): void;
  /**跳转到分享的视频播放页面 */
  function navigateToVideoView(
    param: StandParam & {
      videoId: string;
    }
  ): void;
  function callHostMethod(
    param: StandParam & {
      method: string;
      extra: Record<string, any>;
    }
  ): void;
  function callHostMethodSync(param: {
    method: string;
    extra: Record<string, any>;
  }): void;

  function shareVideo(
    param: StandParam & {
      /** 要转发的视频地址 */
      videoPath: string;
      /**
       * 查询字符串
       * - 必须是 key1=val1&key2=val2 的格式.
       * - 从这条转发消息进入后, 可通过 tt.getLaunchOptionsSync() 或 tt.onShow() 获取启动参数中的 query.
       * - 分享挑战视频时有效
       */
      query?: string;
      /** 要转发的视频描述, 分享挑战视频时有效 */
      title?: string;
      extra?: {
        /** 为true时, 指定分享的为挑战视频(带秒玩入口) */
        createChallenge: boolean;
      };
    }
  ): void;

  /**
   * 数据缓存
   */

  interface StorageInfo {
    /** 本地数据缓存中的所有键名列表, 如本地数据则返回空数组 */
    keys: string[];
    /** 占用空间大小, 以KB为单位 */
    currentSize: number;
    /** 存储空间上限, 以KB为单位, 一般来说会返回10240 */
    limitSize: number;
  }

  function clearStorage(param?: StandParam): void;
  function clearStorageSync(): void;
  function getStorage(param: StandParam<{ data: any }> & { key: string }): void;
  function getStorageSync(key: string): string;
  function setStorage(param: StandParam & { key: string; data: any }): void;
  function setStorageSync(key: string, data: any): void;
  function removeStorage(param: StandParam & { key: string }): void;
  function removeStorageSync(key: string): void;
  function getStorageInfo(param: StandParam<StorageInfo>): void;
  function getStorageInfoSync(): StorageInfo;
  /**
   *
   * 生命周期
   */
  function exitMiniProgram(param: StandParam): void;
  function getLaunchOptionsSync(): {
    errMsg: "getLaunchOptionsSync:ok";
    query: Record<string, string>;
    referrerInfo: Record<string, string>;
  };
  function onShow(
    handler: (
      query: Record<string, any>,
      referrerInfo: Record<string, any>
    ) => void
  ): void;
  function onHide(handler: () => void): void;
  function offShow(handler: (...args: any[]) => void): void;
  function offHide(handler: (...args: any[]) => void): void;

  /**
   * 系统信息
   */
  type safeAreaKey = "left" | "right" | "top" | "bottom" | "width" | "height";
  interface SystemInfo {
    /** 手机品牌 */
    brand: string;
    /** 手机型号 */
    model: string;
    /** 设备像素比 */
    pixelRatio: number;
    /** 屏幕宽度 */
    screenWidth: number;
    /** 屏幕高度 */
    screenHeight: number;
    /** 可使用窗口宽度 */
    windowWidth: number;
    /** 可使用窗口高度 */
    windowHeight: number;
    /** 头条设置的语言 */
    language: string;
    /** 头条版本号 */
    version: string;
    /** Toutiao: 今日头条, Douyin: 抖音 */
    appName: "Toutiao" | "Douyin" | "devtools" | "stt";
    /** 操作系统版本 */
    system: string;
    /** 客户端平台 */
    platform: string;
    /** 用户字体大小设置.以“我-设置-通用-字体大小”中的设置为准, 单位 px. */
    fontSizeSetting: number;
    /** 客户端基础库版本 */
    SDKVersion: string;
    /**
     * 性能等级, 设备性能越好(目前设备最高不到 `50`)
     * - `-2` 或 `0`: 该设备无法运行小游戏
     * - `-1`: 性能未知
     * - `>=1` 设备性能值, 该值越高
     */
    benchmarkLevel: number;
    /**
     * - 电量
     * - 范围 1 - 100
     */
    battery: number;
    /**
     * - wifi 信号强度
     * - 范围 0 - 4
     */
    wifiSignal: number;
    /**在竖屏正方向下的安全区域 */
    safeArea: Record<string, number>;
    /**设备id */
    deviceId: string;
  }

  function getSystemInfo(param: StandParam<SystemInfo>): void;
  function getSystemInfoSync(): SystemInfo;
  /**
   * 触摸事件
   */
  interface Touch {
    /**
     * - Touch 对象的唯一标识符, 只读属性.
     * - 一次触摸动作(我们值的是手指的触摸)在平面上移动的整个过程中, 该标识符不变.
     * - 可以根据它来判断跟踪的是否是同一次触摸过程.
     */
    identifier: number;
    /** 触点相对于屏幕左边沿的 X 坐标. */
    screenX: number;
    /** 触点相对于屏幕上边沿的 Y 坐标. */
    screenY: number;
  }
  interface TouchList {
    readonly length: number;
    item(index: number): Touch | null | undefined;
    [index: number]: Touch;
  }
  interface TouchEvent {
    touches: TouchList;
    changeTouches: TouchList;
    timeStamp: number;
  }
  function onTouchStart(handler: (event: TouchEvent) => void): void;
  function onTouchMove(handler: (event: TouchEvent) => void): void;
  function onTouchEnd(handler: (event: TouchEvent) => void): void;
  function onTouchCancel(handler: (event: TouchEvent) => void): void;
  function offTouchStart(handler: (event: TouchEvent) => void): void;
  function offTouchMove(handler: (event: TouchEvent) => void): void;
  function offTouchEnd(handler: (event: TouchEvent) => void): void;
  function offTouchCancel(handler: (event: TouchEvent) => void): void;

  /**
   * mg
   * 交互
   */
  function showToast(
    param: StandParam & {
      title: string;
      icon?: "success" | "loading" | "none";
      /** 提示框停留时间, 单位 ms 默认 1500 */
      duration?: number;
    }
  ): void;
  function hideToast(param?: StandParam): void;
  function showLoading(param: StandParam & { title: string }): void;
  function hideLoading(param?: StandParam): void;

  /**
   * 暂不支持 confirmColor 和 cancelColor 参数.
   * - title 的长度限制:
   *  - android 端限制为 1 行, 每行约13个汉字；
   *  - iOS 端限制为 3 行, 每行约17个汉字.
   *
   * - content 的长度限制:
   *  - android 端没有限制, Modal 最高为屏幕高度, 内容滚动；
   *  - iOS 端限制为 3 行, 每行约 17 个汉字.
   */
  function showModal(
    param: StandParam<{
      /** 是否点击了确定按钮 */
      confirm: boolean;
      /** 是否点击了取消按钮 */
      cancel: boolean;
    }> & {
      /** 标题 */
      title?: string;
      /** 内容 */
      content?: string;
      /** 确定按钮的文案, 最多4个字符 */
      confirmText?: string;
      /** 是否显示取消按钮 */
      showCancel?: boolean;
      /** 取消按钮的文案, 最多4个字符 */
      cancelText?: string;
    }
  ): void;

  /**
   *
   * iOS 实现时会自动加入「取消」选项, android 不会.
   */
  function showActionSheet(
    param: StandParam<{ tapIndex: number }> & { itemList: string[] }
  ): void;
  function showFavoriteGuide(
    param: StandParam & { type?: string; content?: string; position?: string }
  ): void;

  /**
   * mg
   * 键盘
   *
   */
  function showKeyboard(
    param: StandParam & {
      /** 键盘输入框显示的默认值 */
      defaultValue: string;
      /** 键盘中文本的最大长度 */
      maxLength: number;
      /** 是否为多行输入 */
      multiple: boolean;
      /** 当点击完成时键盘是否收起 */
      confirmHold: boolean;
      /**
       * 键盘右下角按钮
       *  - `done` 完成
       *  - `next` 下一个
       *  - `search` 搜索
       *  - `go` 前往
       *  - `send` 发送
       */
      confirmType: "done" | "next" | "search" | "go" | "send";
    }
  ): void;
  function updateKeyboard(param: StandParam & { value: string }): void;
  function hideKeyboard(param?: StandParam): void;
  function onKeyboardInput(handler: (event: { value: string }) => void): void;
  function onKeyboardComplete(
    handler: (event: { value: string }) => void
  ): void;
  function onKeyboardConfirm(handler: (event: { value: string }) => void): void;
  function offKeyboardComplete(
    handler: (event: { value: string }) => void
  ): void;
  function offKeyboardConfirm(
    handler: (event: { value: string }) => void
  ): void;
  function offKeyboardInput(handler: (event: { value: string }) => void): void;

  /**
   * 菜单
   * */
  interface MenuButtonLayout {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  function getMenuButtonLayout(): MenuButtonLayout;

  /**
   *
   * mg
   * 支付
   */

  /**
   * ### 提示:
   * - 调用该方法时, 需要保证用户已经登录.
   * - 可以调用 checkSession 检测用户登录状态.
   * ### buyQuantity 限制说明
   * - 购买游戏币的数量, 换算成RMB必须满足以下价格档位, 即bugQuantity * 游戏币单价 = 限定价格等级.如: 游戏币单价为0.1元, 一次购买最少数量为10个
   */
  function requestGamePayment(
    param: StandParam<
      {},
      {
        /**
         * - `-1` 支付失败
         * - `-2` 支付取消
         * - `-15001` 缺少参数
         * - `-15002` 请求参数不合法
         * - `-15006` app没有支付权限
         * - `-15009` 财经方失败
         * - `-16000` 用户未登录
         * - `2` 正在支付一起订单时, 又发起了一笔支付请求
         * - `3` 调起收银台失败
         * - `4` 网络异常
         * - `6`; 其他错误
         */
        // prettier-ignore
        errCode: -1 | -2 | -15001 | -15002 | -15006 | -15009 | -16000 | 2 | 3 | 4 | 6;
      }
    > & {
      /** 支付的类型 */
      mode: "game";
      /** 环境配置 */
      env: 0;
      /** 币种 */
      currencyType: "CNY";
      /** 申请接入时的平台 */
      platform: "android";
      /** 购买数量 */
      buyQuantity: number;
      /** 游戏服务器大区id, 游戏不分大区则默认填写"1".如果应用支持多角色, 则角色ID接在分区ID后, 用"_"连接 */
      zoneId?: string;
    }
  ): void;

  /**
   * Worker
   */

  interface Worker {
    postMessage(data: Record<string, any>): void;
    terminate(): void;
    onMessage(handler: (res: { message: Record<string, any> }) => void): void;
  }

  /**
   * ### 创建一个 Worker 线程
   * - 目前限制最多只能创建一个 Worker
   * - 创建下一个 Worker 前请调用 Worker.terminate
   */
  function createWorker(scriptPath: string): Worker;
  /**
   * 更新
   */
  interface UpdateManager {
    /** 应用更新包并重启 */
    applyUpdate(): void;
    /** 监听检查更新结果回调 */
    onCheckForUpdate(handler: (res) => void): void;
    /** 监听更新包下载成功回调 */
    onUpdateReady(handler: (res) => void): void;
    /** 监听更新包下载失败回调 */
    onUpdateFailed(handler: (res) => void): void;
  }

  function getUpdateManager(): UpdateManager;

  /**
   * 性能
   *
   */
  interface Performance {
    now(): number;
  }
  function getPerformance(): Performance;
  function onMemoryWarning(handler: (res: { level: number }) => void): void;
  function triggerGC(): void;

  /**
   * 开放能力
   */

  interface TTLoginInfo {
    code: string; // 临时登录凭证, 有效期 3 分钟
    anonymousCode: string; // 用于标识当前设备, 无论登录与否都会返回, 有效期 3 分钟
    isLogin: boolean; // 判断在当前 APP(头条、抖音等)是否处于登录状态
    errMsg: string;
  }
  /**
   * ### 登录接口
   * @param params.force 未登录时, 是否强制调起登录框, 默认为 true
   */
  function login(param: StandParam<TTLoginInfo> & { force?: boolean }): void;

  /**
   * ### 检查用户当前的 session 状态是否有效
   */
  function checkSession(param: StandParam): void;

  type UserInfo<W extends boolean> = W extends true
    ? {
        userId: string; //玩家id
        avatarUrl: string; // 用户头像
        nickName: string; // 用户名
        gender: number; // 用户性别, 0: 未知；1:男性；2:女性
        city: string; // 用户城市
        province: string; // 用户省份
        country: string; // 用户国家
        language: string; // 用户语言, 目前为空
        rawData: string; // userInfo的JSON字符串形式
        signature: string; // 用于校验用户信息是否被篡改, 请参考文档
        encryptedData: string; // 包括敏感信息（如openId）在内的已加密用户数据, 如需解密数据请参考文档
        iv: string; // 加密算法参数
        watermark: {
          appid: string; // 数据源小程序id
          timestamp: string; // 时间戳, 可以用于检查数据的时效性
        };
      }
    : {
        userId: string;
        avatarUrl: string;
        nickName: string;
        gender: number;
        city: string;
        province: string;
        country: string;
        language: string;
        rawData: string;
      };

  /**
   * 获取已登录用户的基本信息或特殊信息
   * @param param.withCredentials 是否需要返回敏感数据, 默认为 false
   */
  function getUserInfo<W extends boolean>(
    param: StandParam<{ userInfo: UserInfo<W> }> & { withCredentials?: W }
  ): void;

  // TOOD: 确认小游戏是否支持
  // /**
  //  * ### 发起头条支付
  //  * 提示
  //  * - 目前只支持支付宝
  //  * - 本 API 依赖于login, 请确保调用前已经调用了该API
  //  */
  // function requestPayment(
  //   param: StandParam & {
  //     data: {
  //       app_id: string; // 支付分配给业务方的 id
  //       method: string; // 固定值 "tp.trade.confirm"
  //       sign: string; // 商户签名
  //       sign_type: string; //	签名算法, 暂支持 MD5
  //       timestamp: string; // 发送请求的时间戳
  //       trade_no: string; // 支付订单号
  //       merchant_id: string; // 商户 id
  //       uid: string; // 用户的唯一标识 id, 开发者请传 openid, 获取方法
  //       total_amount: number; // 订单金额, 单位为分
  //       pay_channel: string; // 支付渠道, 目前只支持支付宝, 值为 "ALIPAY_NO_SIGN"
  //       pay_type: string; // 支付方式, 目前只支持支付宝, 值为 "ALIPAY_APP"
  //       risk_info: string; // 风控信息, 标准 json 格式字符串(JSON.stringify({ip: "...."})), 目前需要传入用户的真实 IP
  //       params: string; // 传递给支付方的支付信息, 标准 json 格式字符串(JSON.stringify({url: "...."})), 不同的支付方参数格式不一样
  //       return_url?: string; // (支付宝)支付完成返回的地址
  //       show_url?: string; // (支付宝)支付失败返回的地址
  //     };
  //   }
  // ): void;

  /**
   * 开发能力
   * 设置
   *
   */
  interface AuthSetting {
    "scope.userInfo"?: boolean; // 是否授权用户信息, 对应接口 tt.getUserInfo
    "scope.userLocation"?: boolean; // 是否授权地理位置, 对应接口 tt.getLocation
    "scope.address"?: boolean; // 是否授权通讯地址, 对应接口 tt.chooseAddress
    "scope.record"?: boolean; // 是否授权录音功能, 对应接口 tt.getRecorderManager.start
    "scope.album"?: boolean; // 是否授权保存到相册 tt.saveImageToPhotosAlbum, tt.saveVideoToPhotosAlbum
    "scope.camera"?: boolean; // 是否授权摄像头 对应接口 tt.scanCode, tt.chooseImage, tt.chooseVideo
  }

  /**
   * ### 获取用户已经授权过的配置
   * 结果中只会包含小程序向用户请求过的权限
   */
  function getSetting(param: StandParam<{ authSetting: AuthSetting }>): void;

  /**
   * ### 打开设置页面, 返回用户设置过的授权结果
   * 结果中只会包含小程序向用户请求过的权限
   */
  function openSetting(param: StandParam<{ authSetting: AuthSetting }>): void;

  /**
   *
   * 开放能力
   * 授权
   *
   */

  /**
   * ### 调用方法会提前向用户发出授权请求
   * - 该方法不回调用对应接口, 只会弹框咨询用户是否授权或者获取用户信息
   * - 如果用户之前有授权, 该接口直接返回成功, 不会跟用户产生交互
   */
  function authorize(
    param: StandParam & {
      scope:
        | "scope.userInfo" // tt.getUserInfo	是否授权用户信息
        | "scope.userLocation" // tt.getLocation, tt.openLocation	是否授权地理位置
        | "scope.address" // tt.chooseAddress	是否授权通讯地址
        | "scope.record" // tt.getRecorderManager.start	是否授权录音功能
        | "scope.album" // tt.saveImageToPhotosAlbum, tt.saveVideoToPhotosAlbum	是否授权保存到相册
        | "scope.camera"; // tt.scanCode, tt.chooseImage, tt.chooseVideo	是否授权摄像头
    }
  ): void;

  /**
   *
   * 开放能力
   * 数据分析
   */

  function reportAnalytics(
    eventName: string,
    data: { [key: string]: number | string | boolean }
  ): void;

  /**
   * 开放能力
   * 广告
   */

  interface BannerAd {
    show(): Promise<void>;
    hide(): void;
    load(): Promise<void>;
    onLoad(handler: () => void): void;
    offLoad(handler: () => void): void;
    onError(handler: (res: { errCode: number; errMsg: string }) => void): void;
    offError(handler: () => void): void;
    onResize(handler: (res: { width: number; height: number }) => void): void;
    offResize(hanlder: () => void): void;
    destroy(): void;
    // onClose(handler: (res: { isEnd: boolean }) => void): void;
    // offClose(handler: (res: { isEnd: boolean }) => void): void;
  }

  /**今日头条: 支持; 抖音:  不支持 ;今日头条极速版: 支持; */
  function createBannerAd(param: {
    adUnitId: string; // 广告位id
    adIntervals?: number;
    style?: {
      left?: number; // 广告位区域顶点坐标
      top?: number; // 广告位区域顶点坐标
      width?: number; // 128 广告位区域宽度
    };
  }): BannerAd;

  /**广告关闭后的回调参数 */
  interface VideoAdOnCloseParam {
    /**用户是否完整观看了视频 */
    isEnded?: boolean;
    /**用户完整观看了几次视频 */
    count?: number;
  }

  interface VideoAd {
    show(): Promise<void>;
    hide(): void;
    load(): Promise<void>;
    onLoad(handler: () => void): void;
    offLoad(handler: () => void): void;
    onError(handler: (res: { errCode: number; errMsg: string }) => void): void;
    offError(handler: () => void): void;
    onClose(handler: (res: VideoAdOnCloseParam) => void): void;
    offClose(handler: () => void): void;
    destroy(): Promise<void>;
  }

  /**视频广告参数 */
  interface VideoAdOptional {
    /**广告位 id */
    adUnitId?: string;
    /**是否启用多例模式，默认为 false,多例模式下观看广告次数通过 onClose 中的 count 返回。*/
    multiton?: boolean;
    /**更多奖励提醒信息，多例模式下必传。 */
    multitonRewardedMsg?: string;
    /**再得次数 */
    rewardAgainTimes?: number;
  }
  /**
   * - 开发者可以在小游戏中使用Video广告获得收入
   * - Video广告是由客户端原生渲染, 覆盖在整个小游戏 Canvas 区域之上
   * - Video广告展示的时候用户不能操作小游戏
   * - Video广告目前支持竖屏展示
   * - 如果是横屏游戏在展示时会先切到竖屏
   */
  function createRewardedVideoAd(param: VideoAdOptional): VideoAd;

  /**
   * 开放能力
   * 关注
   */
  interface FollowButtonStyle {
    left: number; // 左上角横坐标
    top: number; //  左上角纵坐标
    width: number; // 宽度
    height: number; // 高度
    backgroundColor: string; // 背景颜色
    borderColor: string; // 边框颜色
    borderWidth: number; // 边框宽度
    borderRadius: number; // 边框圆角
    textAlign: string; // 文本的 水平居中方式
    fontSize: number; // 字号
    lineHeight: number; // 	文本的行高
    textColor: string; // 文本颜色
  }

  interface FollowButton {
    onTap(handler: () => void): void;
    offTap(handler: () => void): void;
    destroy(): void;
    show(): void;
  }

  /**
   * 该功能暂时支持在今日头条App上使用
   * - 使用前需要在开发者平台将头条号与小程序进行绑定
   * - 并将需要关注的头条号设置为游戏内头条号
   */
  function createFollowButton(
    param:
      | { type: "text"; style: FollowButtonStyle }
      | { type: "image"; image: string; style: FollowButtonStyle }
  ): FollowButton;

  function checkFollowState(param: StandParam<{ result: boolean }>): void;

  /**
   * 开放能力
   * 更多游戏
   */

  interface MoreGamesButton {
    onTap(handler: () => void): void;
    offTap(handler: () => void): void;
    destroy(): void;
    show(): void;
    hide(): void;
  }

  function createMoreGamesButton(param: {
    type: string;
    image?: string;
    text?: string;
    style: {
      left: number; // 左上角横坐标
      top: number; //  左上角纵坐标
      width: number; // 宽度
      height: number; // 高度
      backgroundColor: string; // 背景颜色
      borderColor: string; // 边框颜色
      borderWidth: number; // 边框宽度
      borderRadius: number; // 边框圆角
      textAlign: string; // 文本的 水平居中方式
      fontSize: number; // 字号
      lineHeight: number; // 	文本的行高
      textColor: string; // 文本颜色
    };
    appLaunchOptions: Array<
      Record<"appId" | "query" | "extraData", string | object>
    >;
    onNavigateToMiniGame(res: { errCode: number; errMsg: string }): void;
  }): MoreGamesButton;

  function showMoreGamesModal(
    param: StandParam & {
      appLaunchOptions: Array<
        Record<"appId" | "query" | "extraData", string | object>
      >;
    }
  ): void;

  function onNavigateToMiniProgram(
    handler: (res: {
      errCode: number;
      errMsg: string;
      from: "showMoreGamesModal" | "createMoreGamesButton";
    }) => void
  ): void;
  function offNavigateToMiniProgram(handler?: (param: any) => void): void;
  function onMoreGamesModalClose(handler: () => void): void;
  function offMoreGamesModalClose(handler?: () => void): void;

  /**
   * 开放能力
   *
   * 开放数据域
   */

  interface OpenDataContext {
    /** 开放数据域和主域共享的 sharedCanvas */
    canvas: tt.Canvas;
    /** 向开放数据域发送消息 */
    postMessage(
      message: Record<string, number | string | boolean | null | undefined>
    ): void;
  }
  function getOpenDataContext(): OpenDataContext;
  function onMessage(handler: (data: Record<string, any>) => void): void;
  /**
   * 开放能力
   *
   * 开放数据
   */
  interface KVData {
    /** 数据的 key */
    key: string;
    /** 数据的 value */
    value: string;
  }
  interface UserGameData {
    /** 用户头像 url */
    avatarUrl: string;
    /** 用户昵称 */
    nickname: string;
    /** 用户的 openid */
    openid: string;
    /** 用户的托管 KV 数据列表 */
    KVDataList: KVData[];
  }

  /**
   * ### 该接口只可在开放数据域下使用
   * - 以上各类型关系均需要宿主APP 支持后, 开发者才可调用接口获取到有效数据
   * - 目前关系数据接口仅在抖音APP下可用, 在头条中使用暂时无法获取有效数据, 只能获取用户自身数据
   */
  function getCloudStorageByRelation(
    param: tt.StandParam<{ data: UserGameData[] }> & {
      type: "friend" | "recommend" | "group";
      keyList: string[];
      extra: Record<"sortKey" | "groupId", string>;
    }
  ): void;

  /**
   * ### 存储数据的限制
   * - 每个 openid 所标识的用户在每个游戏上托管的数据不能超过128个 key-value 对
   * - 上报的 key-value 列表当中每一项的 key+value 长度都不能超过1K(1024)字节
   * - 上报的 key-value 列表当中每一个key长度都不能超过128字节
   */
  function setUserCloudStorage(
    param: tt.StandParam & { KVDataList: KVData[] }
  ): void;

  /**
   * ### 该接口只可在开放数据域下使用
   * - 获取当前用户托管数据当中对应 key 的数据
   */
  function getUserCloudStorage(
    param: tt.StandParam<{ keyList: string[] }> & { keyList: KVData[] }
  ): void;

  function removeUserCloudStorage(
    param: tt.StandParam & { keyList: string[] }
  ): void;

  /**仅在 **开放作用域** 有效*/
  function getSharedCanvas(): tt.Canvas;
  /**
   * 开放能力
   * 排行榜
   */

  /**设置用户分组。 */
  function setUserGroup(param: StandParam & { groupId: string }): void;

  /**
   * 小程序接口
   *
   */
  function canIUse(): boolean;
  function onAppShow(param: {
    path: string;
    scene: number;
    query: Record<string, any>;
    referrerInfo: Record<string, any>;
  }): void;
  function offAppShow(handler: (...args: any[]) => void): void;
  function onAppHide(handler: (...args: any[]) => void): void;
  function offAppHide(handler: (...args: any[]) => void): void;
  function onError(handler: (...args: any[]) => void): void;
  function offError(handler: (...args: any[]) => void): void;
  function base64ToArrayBuffer(param: string): ArrayBuffer;
  function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;

  interface BackgroundAudioManager {
    src: string;
    startTime: number;
    duration: number;
    currentTime: number;
    buffered: number;
    paused: boolean;
    title: string;
    epname: string;
    singer: string;
    coverImgUrl: string;
    webUrl: string;
    protocol: string;
    audioPage: Record<string, any>;
  }

  function getBackgroundAudioManager(): BackgroundAudioManager;

  interface VideoContext {
    play(): void;
    pause(): void;
    stop(): void;
    seek(position: number): void;
    requestFullScreen(): void;
    exitFullScreen(): void;
  }

  function createVideoContext(): VideoContext;

  interface LivePlayerContext {
    play(param: StandParam): void;
    stop(param: StandParam): void;
    mute(param: StandParam): void;
    unmute(param: StandParam): void;
    requestFullScreen(param: StandParam & { direction: string }): void;
    exitFullScreen(param: StandParam): void;
  }
  function createLivePlayerContext(param: {
    id: string;
    component?: Record<string, any>;
  }): LivePlayerContext;

  function openLocation(
    param: StandParam & {
      latitude: number;
      longitude: number;
      scale: number;
      name: string;
      address: string;
    }
  ): void;

  function getConnectedWifi(
    param: StandParam<{
      SSID: string;
      BSSID: string;
      secure: boolean;
      signalStrength: number;
    }>
  ): void; // ck

  function makePhoneCall(param: StandParam & { phoneNumber: string }): void;

  function scanCode(param: StandParam<{ result: string }>): void;

  function onUserCaptureScreen(handler: (...args: any[]) => void): void;

  function offUserCaptureScreen(handler: () => void): void;

  function showNavigationBarLoading(param: StandParam): void;
  function hideNavigationBarLoading(param: StandParam): void;
  function hideHomeButton(param: StandParam): void;
  function setNavigationBarTitle(param: StandParam & { title: string }): void;
  function setNavigationBarColor(
    param: StandParam & { frontColor: string; backgroundColor: string }
  ): void;

  function getMenuButtonBoundingClientRect(
    param: StandParam<{
      width: number;
      height: number;
      top: number;
      right: number;
      bottom: number;
      left: number;
    }>
  ): void;

  function createAnimation(): void;

  function pageScrollTo(
    param: StandParam & { scrollTop: number; duration?: number }
  ): void;

  function createCanvasContext(
    param: StandParam & {
      canvasId: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      destWidth?: number;
      destHeight?: number;
      fileType?: string;
      quality?: number;
    }
  ): Canvas;

  function startPullDownRefresh(param: StandParam): void;
  function stopPullDownRefresh(param: StandParam): void;

  function showTabBarRedDot(param: StandParam & { index: number }): void;
  function showTabBar(param: StandParam & { animation: boolean }): void;

  function setTabBarStyle(
    param: StandParam & {
      color?: string;
      selectedColor?: string;
      backgroundColor?: string;
      borderStyle?: "black" | "white";
    }
  ): void;

  function setTabBarItem(
    param: StandParam & {
      index: number;
      text?: string;
      iconPath?: string;
      selectedIconPath?: string;
    }
  ): void;

  function setTabBarBadge(
    param: StandParam & {
      index: number;
      text: string;
    }
  ): void;

  function removeTabBarBadge(
    param: StandParam & {
      index: number;
    }
  ): void;

  function hideTabBarRedDot(
    param: StandParam & {
      index: number;
    }
  ): void;

  function hideTabBar(
    param: StandParam & {
      animation: boolean;
    }
  ): void;

  function onWindowResize(
    handler: (res: { size: Record<string, number> }) => void
  ): void;
  function offWindowResize(handler: () => void): void;
  function navigateTo(
    param: StandParam & {
      url: string;
    }
  ): void;
  function redirectTo(
    param: StandParam & {
      url: string;
    }
  ): void;
  function switchTab(
    param: StandParam & {
      url: string;
    }
  ): void;
  function navigateBack(
    param: StandParam & {
      delta: number;
    }
  ): void;
  function reLaunch(
    param: StandParam & {
      url: string;
    }
  ): void;

  function getExtConfig(param: StandParam): void;
  function getExtConfigSync(param: StandParam): void;

  function navigateBackMiniProgram(
    param: StandParam & {
      extraData?: Record<string, string>;
    }
  ): void;

  function chooseAddress(
    param: StandParam<{
      errMsg: string;
      userName: string;
      provinceName: string;
      cityName: string;
      countyName: string;
      detailInfo: string;
      telNumber: string;
    }>
  ): void;
  function interactionAnalysis(param: StandParam & { type: string }): void;
  function followOfficialAccount(
    param: StandParam<{
      errCode: number;
    }>
  ): void;

  //***************************  额外接口 *******************************/
  /**获取连麦实例，目前只在helo平台具有的api
   * @example
   * tt.getRtcEngine();
   */
  function getRtcEngine(): rtcEngine;

  /**连麦实例，目前只在helo平台具有 */
  interface rtcEngine {
    /**监听事件 */
    on(
      event:
        | "joinChannelSuccess"
        | "connectionLost"
        | "warning"
        | "error"
        | "userEnableLocalAudio"
        | "userMuteAudio"
        | "userEnableAudio",
      callback: (data: any) => void
    ): void;
    /**广播连麦 channelId，所有用户加入频道 */
    joinChannel(param: {
      /**加入语音频道的id */
      channelId: string;
      /**加入语音频道用户的唯一标识，建议统一使用当前用户的 openId/匿名 openId */
      uid: string;
      /**接口调用成功的回调函数 */
      success?: Function;
      /**接口调用失败的回调函数 */
      fail?: Function;
      /**接口调用结束的回调函数（调用成功、失败都会执行）*/
      complete?: Function;
    }): number;
    /**离开当前频道 */
    leaveChannel(param: {
      /**接口调用成功的回调函数 */
      success?: Function;
      /**接口调用失败的回调函数 */
      fail?: Function;
      /**接口调用结束的回调函数（调用成功、失败都会执行）*/
      complete?: Function;
    }): void;
    /**销毁 RtcEngine 实例，释放所有资源 */
    destroy(): void;
    /**开启本地麦克风推流 */
    enableLocalAudio(): void;
    /**关闭本地麦克风推流 */
    disableLocalAudio(): void;
    /**针对当前设备，取消静音所有远端用户音频流 */
    unmuteAllRemoteAudioStream(): void;
    /**针对当前设备，静音所有远端用户音频流 */
    muteAllRemoteAudioStream(): void;
  }

  /**将游戏图标添加到桌面
     * @example
     * 
    tt.addShortcut({
        success(res) {
            console.warn("addShortcut success", res);
        },
        fail(res) {
            console.error(`addShortcut fail`, res.errMsg || res);
        }
    });
     */
  function addShortcut(param: StandParam): void;

  /**查询快捷方式状态
     * @example
     * 
    tt.checkShortcut({
        success(res) {
            console.warn("checkShortcut success", res);
        },
        fail(res) {
            console.error(`checkShortcut fail`, res.errMsg || res);
        }
    });
     */
  function checkShortcut(param: StandParam): void;

  /**玩家平台信息 */
  interface GeneralInfo {
    info: {
      /**渠道id */
      aid: TTAppType;
      /**设备id */
      device_id: string;
      /**渠道 */
      channel?: string;
      /**sdk版本 */
      tma_jssdk_version?: string; //"2.0.0.0"
      /**app版本 */
      version_code?: string;
    };
  }

  /**平台额外信息 */
  type GeneralData = {
    /**是否使用敏感信息字段 */
    needPrivateData: boolean;
  };

  /**获取平台各种信息 */
  function getGeneralInfo(param: StandParam<GeneralInfo> & GeneralData): void;

  /**电商广告参数 */
  interface ECommerceAdParam {
    /**广告id,  开发者从开发者平台获取，需要设计接口开发传入，需要校验是否合法*/
    ad_unit_id: string;
    /**需要增加白名单校验，针对内部的开发者可以自定义其他数字，否则默认1 */
    banner_type?: number;
    /**果园下单任务需要。目前只有果园开发者会传入，只开放给自研游戏， */
    extra_data?: object;
  }
  /**显示电商广告页 */
  function showECommerceAd(param: StandParam<any> & ECommerceAdParam): void;

  /**
   * 跳转客户端某个内部Schema
   * @see https://bytedance.feishu.cn/docs/F7LBiO5e27qC961thUMhud
   *
   */
  function openSchema(
    params: { schema: string } & StandardOutputParams<any>
  ): void;
}
