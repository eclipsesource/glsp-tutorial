import { injectable, inject } from 'inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import * as $ from 'jquery';

import { FileService } from '@theia/filesystem/lib/browser/file-service';
import URI from '@theia/core/lib/common/uri';
import { WorkspaceService } from '@theia/workspace/lib/browser';

export const AssistanceCommand = {
  id: 'Assistance.command',
  label: 'assistance',
};

@injectable()
export class MarkingElements implements FrontendApplicationContribution {
  private idList: Array<string> = [];
  private currentHint: number = -1;
  private observer: MutationObserver | null;
  private leftPostion: number;
  private topPosition: number;

  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService
  ) {}

  findNewCurrent = () => {
    for (let i = 0; i < this.idList.length; i++) {
      let tmp = this.idList[i];
      if (
        $(this.asId(this.idList[i]) + ':visible').length ||
        $('div' + ':visible')
          .filter(function () {
            return $(this).children().length === 0 && $(this).text() === tmp;
          })
          .parent().length > 0
      ) {
        this.currentHint = i;
        this.currentLeftPosition();
        this.currentTopPosition();
      }
    }
  };

  asId = (id: string) => {
    return '#' + $.escapeSelector(id);
  };

  asContent = (content: string) => {
    return 'div:contains(' + content + ')';
  };

  markCurrent = () => {
    $('body').append(
      '<span id="pointer" style="color:yellow;" >&#8592;</span>'
    );
    $('#pointer').css({
      left: this.currentLeftPosition(),
      top: this.currentTopPosition(),
      position: 'absolute',
      'z-index': '1000',
    });
  };

  currentLeftPosition = () => {
    if ($(this.asId(this.idList[this.currentHint])).length) {
      this.leftPostion =
        $(this.asId(this.idList[this.currentHint]))[0].getBoundingClientRect()
          .right + $(window)['scrollLeft']()!;
    } else {
      let tmp = this.idList[this.currentHint];
      this.leftPostion =
        $('div' + ':visible')
          .filter(function () {
            return $(this).children().length === 0 && $(this).text() === tmp;
          })
          .parent()[0]
          .getBoundingClientRect().right + $(window)['scrollLeft']()!;
    }
    return this.leftPostion;
  };

  currentTopPosition = () => {
    if ($(this.asId(this.idList[this.currentHint])).length) {
      this.topPosition =
        $(this.asId(this.idList[this.currentHint]))[0].getBoundingClientRect()
          .top + $(window)['scrollTop']()!;
    } else {
      let tmp = this.idList[this.currentHint];
      this.topPosition =
        $('div' + ':visible')
          .filter(function () {
            return $(this).children().length === 0 && $(this).text() === tmp;
          })
          .parent()[0]
          .getBoundingClientRect().top + $(window)['scrollTop']()!;
    }
    return this.topPosition;
  };

  finishAssistance = () => {
    if (this.observer != undefined) {
      this.observer.disconnect();
      this.observer = null;
    }

    MutationObserver = window.MutationObserver;
    let observer = new MutationObserver(() => {
      let oldHint = this.currentHint;
      let oldTop = this.topPosition;
      let oldLeft = this.leftPostion;
      this.findNewCurrent();
      if (oldHint == this.currentHint) {
        if (oldTop != this.topPosition || oldLeft != this.leftPostion) {
          this.markCurrent();
        }
      } else {
        this.cleanUp();
        observer.disconnect();
      }
    });

    observer.observe(document, {
      subtree: true,
      childList: true,
    });

    setTimeout(() => {
      this.cleanUp();
    }, 5000);
  };

  cleanUp = () => {
    $('#pointer').remove();
    this.currentHint = -1;
    this.topPosition = -1;
    this.leftPostion = -1;
  };

  prepareNextStep = () => {
    if (this.observer != undefined) {
      this.observer.disconnect();
      this.observer = null;
    }
    MutationObserver = window.MutationObserver;
    this.observer = new MutationObserver(() => {
      this.observe();
    });

    this.observer.observe(document, {
      subtree: true,
      childList: true,
    });
  };

  observe = () => {
    let oldHint = this.currentHint;
    let oldTop = this.topPosition;
    let oldLeft = this.leftPostion;
    this.findNewCurrent();
    if (
      oldHint != this.currentHint ||
      oldTop != this.topPosition ||
      oldLeft != this.leftPostion
    ) {
      this.markCurrent();
      if (this.currentHint + 1 == this.idList.length) {
        this.finishAssistance();
      } else {
        this.prepareNextStep();
      }
    }
  };

  initialize() {
    this.workspaceService.recentWorkspaces().then((res) => {
      let uri = new URI(res[0] + '/.tutorial/assistance.json');
      this.fileService.onDidFilesChange((event) => {
        if (event.contains(uri)) {
          this.fileService.read(uri).then((fileText) => {
            this.idList = JSON.parse(fileText.value);

            this.observe();
          });
        }
      });
      this.fileService.watch(uri);
    });
  }
}
