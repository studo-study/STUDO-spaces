import {HiSpeakerphone} from "react-icons/hi";
import {SlOptions} from "react-icons/sl";

export default function LearnPage() {
    return  <div className=" w-full h-full flex flex-col dark:text-white  items-center pt-50 gap-10 scroll-hidden">
        <section className={"w-2/3 h-fit gap-5 flex flex-col"}>
            <div className={"w-full h-15 gap-2 flex flex-col"}>
                <div className={"w-full flex items-center justify-between"}>
                    <span>index</span>
                    <span>length</span>
                </div>
                <div className={"w-full h-3 rounded-full border border-studoborder"}></div>
            </div>
          <div className={"w-full h-130 rounded-4xl border border-studoborder p-5 gap-5 flex flex-col justify-between items-center"}>
              <div className={'w-full min-h-12 gap-2 rounded-2xl flex flex-row items-center'}>
                  <div className={'w-full h-12 dark:text-white cursor-pointer rounded-full border border-studoborder flex  items-center px-5'}>
                    Definitie
                  </div>
                  <div className={'min-w-12 h-12 dark:text-white cursor-pointer rounded-full border border-studoborder flex  items-center justify-center'}>
                      <HiSpeakerphone />
                  </div>
                  <div className={'min-w-12 h-12 dark:text-white cursor-pointer rounded-full border border-studoborder flex  items-center justify-center'}>
                      <SlOptions />
                  </div>
              </div>
              <div className={'w-full h-full flex flex-row gap-5'}>
                  <div className={'w-2/3 h-full rounded-2xl border border-studoborder p-5'}>
                      term of definitie
                  </div>
                  <div className={'w-1/3 h-full rounded-2xl border border-studoborder p-5'}>
                      eventuele afbeelding
                  </div>
              </div>
              <div className={'min-h-20 w-full flex flex-col gap-2'}>
                  <div className={"w-full flex justify-end gap-5 px-5"}>
                      <button>hint</button>
                      <button>ik weet het niet</button>
                  </div>
                  <div className={"border px-5 border-studoborder flex items-center rounded-2xl w-full h-full"}>
                      input
                  </div>
              </div>
          </div>

        </section>
    </div>
}