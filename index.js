$(function () {
    var canvas = $("#canvas").get(0);
    var ctx = canvas.getContext("2d");
    var ROW = 15;
    var width = canvas.width;
    var off = width / ROW;
    var flag = true;   //黑白棋开关
    var blocks = {};
    var mask = $(".mask");
    var msg = $(".mask .msg");
    var ai = false;
    var blank = {};
    var bt = 0;
    var wt = 0;
    var t1 = 0;
    var t2 = 0;
    //生成所有空白格子(没下过棋的)
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            blank[t2k(i, j)] = {x: i, y: j};
        }
    }
    function p2k(position) {
        return position.x + "_" + position.y;
    }

    function t2k(x, y) {
        return x + "_" + y;
    }

    function writeblack() {
        if (bt >= 60) {
            bt = bt - 60;
            t1++;
            if (t1 === 5) {
                $(canvas).off("click");
                msg.text("黑棋超时,白棋赢");
                mask.show();
                review();
                clearTime();
                return;
            }
        }
        if (bt < 10) {
            $(".black").text("黑棋 0" + t1 + ":0" + bt);
        } else {
            $(".black").text("黑棋 0" + t1 + ":" + bt);
        }
        ;
        bt++;
    }

    function writewhite() {
        if (wt >= 60) {
            wt = wt - 60;
            t2++;
            if (t2 === 5) {
                $(canvas).off("click");
                msg.text("白棋超时,黑棋赢");
                mask.show();
                review();
                clearTime();
                return;
            }
        }
        if (wt < 10) {
            $(".white").text("白棋 0" + t2 + ":0" + wt);
        } else {
            $(".white").text("白棋 0" + t2 + ":" + wt);
        }
        wt++;
    }

    var btm;
    var wtm;
    //画棋盘
    function draw() {
        //画横线
        ctx.beginPath();
        //0.5解决双倍像素线的问题
        for (var i = 0; i < 15; i++) {
            ctx.moveTo(off / 2 + 0.5, off / 2 + 0.5 + i * off);
            ctx.lineTo((15 - 0.5) * off + 0.5, off / 2 + 0.5 + i * off);
        }
        ctx.stroke();
        ctx.closePath();
        //画竖线
        ctx.beginPath();
        for (var i = 0; i < 15; i++) {
            ctx.moveTo(off / 2 + 0.5 + i * off, off / 2 + 0.5);
            ctx.lineTo(off / 2 + 0.5 + i * off, (15 - 0.5) * off + 0.5);
        }
        ctx.stroke();
        ctx.closePath();
        //画5个点
        drawCircle(3.5, 3.5);
        drawCircle(11.5, 3.5);
        drawCircle(7.5, 7.5);
        drawCircle(3.5, 11.5);
        drawCircle(11.5, 11.5);
    }

    //画小点点
    function drawCircle(x, y) {
        ctx.beginPath();
        ctx.arc(x * off + 0.5, y * off + 0.5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    //画棋子
    function drawChess(position, color) {
        ctx.save();
        ctx.translate((position.x + 0.5) * off + 0.5, (position.y + 0.5) * off + 0.5);
        ctx.beginPath();
        if (color == "black") {
            // var radgrad = ctx.createRadialGradient(-4, -4, 1, 0, 0, 15);
            // radgrad.addColorStop(0, '#fff');
            // radgrad.addColorStop(0.3, '#000');
            // ctx.fillStyle = radgrad;
            ctx.fillStyle = "black";
        } else if (color == "white") {
            ctx.fillStyle = "white";
        }
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        blocks[p2k(position)] = color;
        delete blank[t2k(position.x, position.y)];
    }

    //判断输赢
    function check(position, color) {
        var num1 = 1;
        var num2 = 1;
        var num3 = 1;
        var num4 = 1;
        var table = {};
        for (var i in blocks) {
            if (blocks[i] === color) {
                table[i] = true;
            }
        }
        var tx = position.x;
        var ty = position.y;
        while (table[t2k(tx + 1, ty)]) {
            num1++;
            tx++;
        }
        tx = position.x;
        ty = position.y;
        while (table[t2k(tx - 1, ty)]) {
            num1++;
            tx--;
        }

        tx = position.x;
        ty = position.y;
        while (table[t2k(tx, ty + 1)]) {
            num2++;
            ty++;
        }
        tx = position.x;
        ty = position.y;
        while (table[t2k(tx, ty - 1)]) {
            num2++;
            ty--;
        }

        tx = position.x;
        ty = position.y;
        while (table[t2k(tx + 1, ty + 1)]) {
            num3++;
            tx++;
            ty++;
        }
        tx = position.x;
        ty = position.y;
        while (table[t2k(tx - 1, ty - 1)]) {
            num3++;
            tx--;
            ty--;
        }

        tx = position.x;
        ty = position.y;
        while (table[t2k(tx + 1, ty - 1)]) {
            num4++;
            tx++;
            ty--;
        }
        tx = position.x;
        ty = position.y;
        while (table[t2k(tx - 1, ty + 1)]) {
            num4++;
            tx--;
            ty++;
        }
        var maxNum = Math.max(num1, num2, num3, num4);
        return maxNum;
    }

    //写字
    function drawText(pos, text, color) {
        ctx.save();
        ctx.font = "20px san-serif";
        if (color === "black") {
            ctx.fillStyle = "white";
        } else if (color === "white") {
            ctx.fillStyle = "black";
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, (pos.x + 0.5) * off, (pos.y + 0.5) * off);
        ctx.restore();
    }

    function k2o(pos) {
        return {x: parseInt(pos.split("_")[0]), y: parseInt(pos.split("_")[1])};
    }

    //棋谱
    function review() {
        var i = 1;
        for (var pos in blocks) {
            drawText(k2o(pos), i, blocks[pos]);
            i++;
        }
    }

    function AI() {
        var max1 = -Infinity;
        var max2 = -Infinity;
        var pos1 = {};
        var pos2 = {};
        for (var i in blank) {
            if (check(k2o(i), "black") > max1) {
                max1 = check(k2o(i), "black");
                pos1 = blank[i];
            }
            if (check(k2o(i), "white") > max2) {
                max2 = check(k2o(i), "white");
                pos2 = blank[i];
            }
        }
        if (max1 > max2) {
            return pos1;
        } else {
            return pos2;
        }
    }

    function clearTime() {
        clearInterval(btm);
        clearInterval(wtm);
        bt = 0;
        wt = 0;
        t1 = 0;
        t2 = 0;
    }

    function handdleClick(e) {
        var position = {x: Math.round((e.offsetX - off / 2) / off), y: Math.round((e.offsetY - off / 2) / off)};
        if (blocks[p2k(position)]) {
            return;
        }
        if (ai) {
            drawChess(position, "black");
            if (check(position, "black") >= 5) {
                $(canvas).off("click");
                msg.text("黑棋赢");
                mask.show();
                review();
                return;
            }
            drawChess(AI(), "white");
            if (check(AI(), "white") >= 6) {
                $(canvas).off("click");
                msg.text("白棋赢");
                mask.show();
                review();
                return;
            }
            return;
        }
        if (flag) {
            drawChess(position, "black");
            clearInterval(btm);
            wtm = setInterval(writewhite, 1000);
            if (check(position, "black") >= 5) {
                $(canvas).off("click");
                msg.text("黑棋赢");
                mask.show();
                review();
                clearTime();
                return;
            }
        } else {
            drawChess(position, "white");
            clearInterval(wtm);
            btm = setInterval(writeblack, 1000);
            if (check(position, "white") >= 5) {
                $(canvas).off("click");
                msg.text("白棋赢");
                mask.show();
                review();
                clearTime();
                return;
            }
        }
        flag = !flag;
    }

    function restart() {
        blocks = {};
        ctx.clearRect(0, 0, width, width);
        draw();
        $(canvas).off("click").on("click", handdleClick);
        $(".ai").add($(".pp")).addClass("show");
        clearTime();
        writeblack();
        writewhite();
    }

    //落子
    $(canvas).on("click", handdleClick);
    //遮罩层点击消失
    $(".mask").on("click", function () {
        $(this).hide();
    })
    draw();
    $("#restart").on("click", restart);
    $(".ai").on("click", function () {
        var left = $(document.body).outerWidth(true);
        $(this).toggleClass("active");
        ai = !ai;
        $(".pp").removeClass("active");
        $(canvas).show();
        $(this).removeClass("show");
        $(".pp").removeClass("show");
        $(".time").animate({left: left / 2 - 300}, 1000).delay(2000).queue(function () {
            $(this).animate({left: -2000}, 1000).dequeue();
        })
        $("#start").off("click");
        clearInterval(btm);
    })
    $(".pp").on("click", function () {
        var left = $(document.body).outerWidth(true);
        $(this).addClass("active");
        $(".ai").removeClass("active");
        $(canvas).show();
        $(this).removeClass("show");
        $(".ai").removeClass("show");
        $(".time").animate({left: left / 2 - 300}, 1000).delay(2000).queue(function () {
            $(this).animate({left: -2000}, 1000).dequeue().delay(1000).queue(function () {
                $(this).dequeue();
            })
            btm = setInterval(writeblack, 1000);
        })
        $("#start").off("click");
    })
    $("#start").on("click", function () {
        $(".ai").add($(".pp")).addClass("show");
    })

    var watch1 = $("#watch1").get(0);
    var pen1 = watch1.getContext("2d");
    // ctx2.translate(20, 257);
    function clock() {
        pen1.clearRect(0, 0, 300, 300);
        function huadazhizhen() {
            pen1.beginPath();
            pen1.moveTo(0, 100);
            pen1.lineTo(0, 130);
            pen1.closePath();
            pen1.stroke();
        }

        function huaxiaozhizhen() {
            pen1.beginPath();
            pen1.moveTo(0, 120);
            pen1.lineTo(0, 130);
            pen1.closePath();
            pen1.stroke();
        }

        pen1.save();
        pen1.translate(150, 150);
        pen1.moveTo(130, 0);
        pen1.arc(0, 0, 130, 0, Math.PI * 2);
        pen1.stroke();
        for (var i = 0; i < 12; i++) {
            huadazhizhen();
            pen1.rotate(Math.PI / 6);
        }
        for (var i = 0; i < 60; i++) {
            huaxiaozhizhen();
            pen1.rotate(Math.PI / 30);
        }

        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        //秒针
        pen1.save();
        pen1.rotate(2 * Math.PI * s / 60);
        pen1.beginPath();
        pen1.moveTo(0, 20);
        pen1.lineTo(0, 10);
        pen1.moveTo(10, 0);
        pen1.arc(0, 0, 10, 0, Math.PI * 2);
        pen1.moveTo(0, -10);
        pen1.lineTo(0, -90);
        pen1.closePath();
        pen1.stroke();
        pen1.restore();

        //分针
        pen1.save();
        pen1.rotate(Math.PI * 2 * (m * 60 + s) / 3600);
        pen1.beginPath();
        pen1.moveTo(0, 15);
        pen1.lineTo(0, 5);
        pen1.moveTo(5, 0);
        pen1.arc(0, 0, 5, 0, Math.PI * 2);
        pen1.moveTo(0, -5);
        pen1.lineTo(0, -80);
        pen1.closePath();
        pen1.stroke();
        pen1.restore();
        //时针
        pen1.save();
        if (h > 11) {
            h = Math.abs(h - 12);
        }
        pen1.rotate(Math.PI * 2 * (h * 60 + m) * 5 / 3600);
        pen1.beginPath();
        pen1.moveTo(0, 12);
        pen1.lineTo(0, 2);
        pen1.moveTo(2, 0);
        pen1.arc(0, 0, 2, 0, Math.PI * 2);
        pen1.moveTo(0, -2);
        pen1.lineTo(0, -60);
        pen1.closePath();
        pen1.stroke();
        pen1.restore();

        pen1.restore();
    }
    var bt=setInterval(clock, 500);

})