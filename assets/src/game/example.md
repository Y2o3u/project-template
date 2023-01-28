    // 使用dayjs，避免一个时间戳调试时看不出具体日期
    let formatDate = dayjs().format("YYYY/MM/DD");
    console.log("dayjs", formatDate);
    let now = dayjs(Date.now());
    console.log("dayjs_now", now);


    // 使用interval
    this.interval(() => {
      console.log("this is interval");
    }, 10);

    // 使用timeout
    this.timeout(() => {
      console.log("this is timeout");
    }, 1);

    // 使用countdown
    this.countDown((left) => {
      console.log("剩余倒计时", left);
    }, 100);
