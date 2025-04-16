export default class Utils {
    static subjectText(subject) {
        // Map subject to a human-readable string
        const subjectMap = {
          chinese: "國文",
          english: "英文",
          math: "數學",
          society: "社會",
          nature: "自然",
          history: "歷史",
          geography: "地理",
          civics: "公民與社會",
        };
        return subjectMap[subject] || subject;
      }

      static statusText(status) {
        // Map status to a human-readable string
        const statusMap = {
          idle: "待處理",
          download: "下載中",
          "split-audio": "分割語音中",
          "split-text": "分段中",
          transcribe: "轉寫逐字稿中",
          coding: "編碼中",
          done: "完成",
          error: "錯誤"
        };
        return statusMap[status] || status;
      }

      static statusColor(status) {
        // Map status to a human-readable string
        const statusMap = {
          idle: "tertiary",
          download: "tertiary",
          "split-audio": "tertiary",
          "split-text": "tertiary",
          transcribe: "tertiary",
          coding: "tertiary",
          done: "success",
          error: "danger"
        };
        return statusMap[status] || status;
      }

      static isYoutubeUrl(url) {
        //Check valid YouTube URL
        const youtubeRegex = new RegExp(
            '^(https?:\\/\\/)?(www\\.)?(' +
            // 1) youtube.com/watch? with anything, then v=, then 11 chars, then anything
            'youtube\\.com\\/watch\\?.*v=[\\w-]{11}.*' +
            '|' +
            // 2) short link: youtu.be/ + 11 chars + optional extra
            'youtu\\.be\\/[\\w-]{11}.*' +
            ')$'
        );
        return youtubeRegex.test(url);
      }

      static getMimeTypeFromExtension(extension = "txt") {
        if (extension[0] === ".") {
            extension = extension.substring
        }
        return {
            "aac": "audio/aac",
            "abw": "application/x-abiword",
            "arc": "application/x-freearc",
            "avi": "video/x-msvideo",
            "azw": "application/vnd.amazon.ebook",
            "bin": "application/octet-stream",
            "bmp": "image/bmp",
            "bz": "application/x-bzip",
            "bz2": "application/x-bzip2",
            "cda": "application/x-cdf",
            "csh": "application/x-csh",
            "css": "text/css",
            "csv": "text/csv",
            "doc": "application/msword",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "eot": "application/vnd.ms-fontobject",
            "epub": "application/epub+zip",
            "gz": "application/gzip",
            "gif": "image/gif",
            "htm": "text/html",
            "html": "text/html",
            "ico": "image/vnd.microsoft.icon",
            "ics": "text/calendar",
            "jar": "application/java-archive",
            "jpeg": "image/jpeg",
            "jpg": "image/jpeg",
            "js": "text/javascript",
            "json": "application/json",
            "jsonld": "application/ld+json",
            "mid": "audio/midi audio/x-midi",
            "midi": "audio/midi audio/x-midi",
            "mjs": "text/javascript",
            "mp3": "audio/mpeg",
            "mp4": "video/mp4",
            "mpeg": "video/mpeg",
            "mpkg": "application/vnd.apple.installer+xml",
            "odp": "application/vnd.oasis.opendocument.presentation",
            "ods": "application/vnd.oasis.opendocument.spreadsheet",
            "odt": "application/vnd.oasis.opendocument.text",
            "oga": "audio/ogg",
            "ogv": "video/ogg",
            "ogx": "application/ogg",
            "opus": "audio/opus",
            "otf": "font/otf",
            "png": "image/png",
            "pdf": "application/pdf",
            "php": "application/x-httpd-php",
            "ppt": "application/vnd.ms-powerpoint",
            "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "rar": "application/vnd.rar",
            "rtf": "application/rtf",
            "sh": "application/x-sh",
            "svg": "image/svg+xml",
            "swf": "application/x-shockwave-flash",
            "tar": "application/x-tar",
            "tif": "image/tiff",
            "tiff": "image/tiff",
            "ts": "video/mp2t",
            "ttf": "font/ttf",
            "txt": "text/plain",
            "vsd": "application/vnd.visio",
            "wav": "audio/wav",
            "weba": "audio/webm",
            "webm": "video/webm",
            "webp": "image/webp",
            "woff": "font/woff",
            "woff2": "font/woff2",
            "xhtml": "application/xhtml+xml",
            "xls": "application/vnd.ms-excel",
            "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "xml": "application/xml",
            "xul": "application/vnd.mozilla.xul+xml",
            "zip": "application/zip",
            "3gp": "video/3gpp",
            "3g2": "video/3gpp2",
            "7z": "application/x-7z-compressed"
        }[extension] || "application/octet-stream";
    }
}