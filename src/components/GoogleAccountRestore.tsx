import { Fragment, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { Popover, Transition, Dialog } from '@headlessui/react'
import { CheckCircleIcon, CheckIcon, FolderIcon } from '@heroicons/react/24/outline'
import { prepareBackup, restoreBackup } from '@/actions/integrations'
import { backupFileData } from '@/lib/definitions'
import { useNotification } from '@/app/NotificationsProvider'

export default function GoogleAccountRestore({
  googleAccountId,
  callClose,
  backupData,
}: {
  backupData: backupFileData | null
  googleAccountId: string
  callClose: () => {}
}) {
  const { showNotification, hideNotification } = useNotification()
  // click 3 times to confirm restore
  const AMOUTOFCONFIRMATIONTIMES = 3

  const [loading, setLoading] = useState(false)
  const [confirmationTimes, setConfirmationTimes] = useState(0)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!open) {
      callClose()
    }
  }, [open])

  async function handleRestoreClick(event: any): Promise<void> {
    event.preventDefault()

    if (AMOUTOFCONFIRMATIONTIMES > confirmationTimes) {
      setConfirmationTimes((prevCount) => prevCount + 1)
    } else if (confirmationTimes >= AMOUTOFCONFIRMATIONTIMES) {
      setLoading(true)

      try {
        const response = await restoreBackup(backupData?.data!)
        setOpen(false)
        showNotification(
          'Successfully restored data',
          `Your google contacts (${response.processed}) were restored`,
          <CheckCircleIcon
            className="h-6 w-6 text-green-400"
            aria-hidden="true"
          />,
        )
      } catch (error) {}
      setLoading(false)
      setConfirmationTimes(0)
    }
  }
  return (
    <>
      {backupData && (
        <Transition show={open}>
          <Dialog className="relative z-10" onClose={setOpen}>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <FolderIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Restore your google contacts backup
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Selected backup is from <b>({backupData.email})</b>{' '}
                            google account made{' '}
                            <b>{backupData.date.toLocaleString()}</b>. Please
                            note that this will{' '}
                            <b>
                              overwrite all your current contacts in Google
                              Contacts
                            </b>
                            . So be extremely careful while restoring your
                            contacts.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleRestoreClick}
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      >
                        {loading
                          ? 'Loading...'
                          : confirmationTimes > 0 &&
                              AMOUTOFCONFIRMATIONTIMES - confirmationTimes > 0
                            ? `Click ${AMOUTOFCONFIRMATIONTIMES - confirmationTimes} more times to confirm`
                            : 'Restore from backup'}
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={() => setOpen(false)}
                        data-autofocus
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  )
}
