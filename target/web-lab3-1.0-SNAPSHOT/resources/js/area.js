
const area = new (function () {
    'use strict';

    const MIN_AVAILABLE_R = 0.1;
    const MAX_AVAILABLE_R = 3;

    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;
    const CANVAS_STEP_X = CANVAS_WIDTH / 2 / 6;
    const CANVAS_STEP_Y = CANVAS_HEIGHT / 2 / 6;

    const CANVAS_COLOR_PRIMARY = '#090909';
    const CANVAS_COLOR_SECONDARY = '#C0C0C0';
    const CANVAS_COLOR_BACKGROUND = '#F9F9F9';
    const CANVAS_COLOR_SHADOW = 'rgba(0, 0, 0, 0.5)';
    const CANVAS_COLOR_AREA = '#007AD9';
    const CANVAS_COLOR_POINT_OTHER = '#333333';
    const CANVAS_COLOR_POINT_INCLUDES = '#00ff00';
    const CANVAS_COLOR_POINT_NOT_INCLUDES = '#ff0000';

    const self = this;

    self.r = null;
    self.history = [];
    self.onRChanged = function (r) {
        r = +r;

        if (isNaN(r) || r < MIN_AVAILABLE_R || r > MAX_AVAILABLE_R) {
            self.r = null;
        } else {
            self.r = r;
        }

        setTimeout(self.repaint, 1);
    };

    self.setHistory = function(history) {
        if (history instanceof Array) {
            self.history = history;
            self.repaint();
        }
    };

    self.sendForm = (x, y, r) => {
        document.getElementById('areaForm:areaXField').value = x;
        document.getElementById('areaForm:areaYField').value = y;
        document.getElementById('areaForm:areaRField').value = r;

        document.getElementById('areaForm:areaSubmitButton').click();
    };

    self.onClickOnCanvas = function(canvas, canvasScale, canvasTranslate) {
        if (self.r == null) {
            return () => displayError('R не задан');
        }

        return function(event) {
            const offsetLeft = parseInt(getCurrentStyle(canvas, 'border-left-width'), 10);
            const offsetTop = parseInt(getCurrentStyle(canvas, 'border-top-width'), 10);

            const rect = canvas.getBoundingClientRect();
            const x = Math.ceil(event.clientX - rect.left - offsetLeft) / canvasScale - canvasTranslate.x;
            const y = Math.ceil(event.clientY - rect.top - offsetTop) / canvasScale - canvasTranslate.y;

            if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
                return;
            }

            const centerX = CANVAS_WIDTH / 2;
            const centerY = CANVAS_HEIGHT / 2;

            const zoomX = CANVAS_WIDTH / 12;
            const zoomY = CANVAS_HEIGHT / 12;

            self.sendForm((x - centerX) / zoomX, (centerY - y) / zoomY, self.r);
        };
    };

    self.repaint = function () {
        const canvas = document.getElementById('areaCanvas');
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');

        const actualCanvasSize = {
            width: parseInt(getCurrentStyle(canvas, 'width'), 10),
            height: parseInt(getCurrentStyle(canvas, 'height'), 10)
        };

        // Init canvas
        context.globalAlpha = 1;
        context.resetTransform();
        context.clearRect(0, 0, canvas.width, canvas.height);

        const canvasScale = Math.min(
            actualCanvasSize.width / CANVAS_WIDTH,
            actualCanvasSize.height / CANVAS_HEIGHT
        );

        context.scale(canvasScale, canvasScale);

        const canvasTranslate = {
            x: (actualCanvasSize.width / canvasScale - CANVAS_WIDTH) / 2,
            y: (actualCanvasSize.height / canvasScale - CANVAS_HEIGHT) / 2
        };

        context.translate(canvasTranslate.x, canvasTranslate.y);

        context.strokeStyle = CANVAS_COLOR_PRIMARY;
        context.fillStyle = CANVAS_COLOR_BACKGROUND;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Clip
        context.beginPath();
        context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.clip();

        // Area
        if (self.r) {
            const R = +self.r;
            const halfR = +self.r / 2;

            context.fillStyle = CANVAS_COLOR_AREA;

            context.beginPath();
            context.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * R, CANVAS_HEIGHT / 2);
            context.arcTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * R, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * R,
                CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * R,
                Math.abs((CANVAS_STEP_X + CANVAS_STEP_Y) / 2 * R));
            context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * R, CANVAS_HEIGHT / 2);
            context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * R, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * halfR);
            context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * halfR);
            context.fill();

            context.fillStyle = CANVAS_COLOR_BACKGROUND;
        }

        // Grid
        context.strokeStyle = CANVAS_COLOR_SECONDARY;

        context.beginPath();
        for (let i = 1; i < 6 * 2; ++i) {
            context.moveTo(CANVAS_STEP_X / 4, i * CANVAS_STEP_Y);
            context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 4, i * CANVAS_STEP_Y);

            context.moveTo(i * CANVAS_STEP_X, CANVAS_STEP_Y / 4);
            context.lineTo(i * CANVAS_STEP_X, CANVAS_HEIGHT - CANVAS_STEP_Y / 4);
        }
        context.stroke();
        context.strokeStyle = CANVAS_COLOR_PRIMARY;

        // Axises
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.moveTo(CANVAS_WIDTH - CANVAS_STEP_X, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y / 4);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y / 4);

        context.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - CANVAS_STEP_Y / 2);
        context.lineTo(CANVAS_WIDTH / 2, CANVAS_STEP_X / 2);
        context.moveTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X / 4, CANVAS_STEP_Y);
        context.lineTo(CANVAS_WIDTH / 2, CANVAS_STEP_Y / 2);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X / 4, CANVAS_STEP_Y);
        context.stroke();

        context.lineWidth = 1;

        // Shadow
        context.fillStyle = CANVAS_COLOR_SHADOW;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(CANVAS_WIDTH, 0);
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        context.lineTo(0, CANVAS_HEIGHT);
        context.closePath();

        context.moveTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * 4, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * 5);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * 4, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * 5);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * 4, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * 5);
        context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * 4, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * 5);
        context.closePath();

        context.fill('evenodd');

        context.fillStyle = CANVAS_COLOR_BACKGROUND;

        // History
        context.lineWidth = 0.5;

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        self.history.forEach((point) => {
            context.fillStyle = point.r !== self.r
                ? CANVAS_COLOR_POINT_OTHER
                : point.result
                    ? CANVAS_COLOR_POINT_INCLUDES
                    : CANVAS_COLOR_POINT_NOT_INCLUDES
            ;

            context.beginPath();
            context.arc(
                centerX + +point.x * CANVAS_STEP_X,
                centerY - +point.y * CANVAS_STEP_Y,
                3, 0, Math.PI * 2
            );
            context.fill();
            context.stroke();
        });

        context.fillStyle = CANVAS_COLOR_BACKGROUND;

        canvas.onclick = self.onClickOnCanvas(canvas, canvasScale, canvasTranslate);
    };

    function getCurrentStyle(element, style) {
        try {
            return window.getComputedStyle(element, null).getPropertyValue(style);
        } catch (e) {
            // noinspection JSUnresolvedVariable
            return element.currentStyle[style];
        }
    }

    function displayError(message) {
        const errorElement = document.getElementById('error');

        errorElement.innerText = message;
        errorElement.style.display = message ? 'inherit' : 'none';
    }
})();
