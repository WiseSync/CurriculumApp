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
}