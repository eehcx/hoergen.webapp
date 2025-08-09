import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { SelectDropdown } from '@/components/select-dropdown'
import React, { useState } from 'react';

const REASONS = [
	'Spam',
	'Inappropriate content',
	'Copyright violation',
	'Abuse or harassment',
	'Other',
];

interface ReportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stationName: string;
	stationId: string;
	userId: string;
	onSubmit: (data: {
		userId: string;
		targetType: 'station';
		targetId: string;
		reason: string;
		details: string;
		status: 'pending';
	}) => void;
	isPending: boolean;
	isError: boolean;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
	open,
	onOpenChange,
	stationName,
	stationId,
	userId,
	onSubmit,
	isPending,
	isError,
}) => {
	const [step, setStep] = useState(0);
	const [reason, setReason] = useState('');
	const [details, setDetails] = useState('');

	const handleNext = () => setStep((s) => s + 1);
	const handleBack = () => setStep((s) => s - 1);
	const handleReset = () => {
		setStep(0);
		setReason('');
		setDetails('');
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleReset}>
			<DialogContent
				className='p-0 border-0 rounded-none'
				style={{ borderRadius: 0 }}
			>
				<DialogTitle
					className='px-6 pt-6 pb-2 font-bold text-lg border-b border-zinc-200 dark:border-zinc-800'
					style={{ borderRadius: 0 }}
				>
					Report station
				</DialogTitle>
				<form
					className='flex flex-col gap-3 px-6 py-6'
					onSubmit={(e) => {
						e.preventDefault();
						if (step === 2) {
							onSubmit({
								userId,
								targetType: 'station',
								targetId: stationId,
								reason,
								details,
								status: 'pending',
							});
						} else {
							handleNext();
						}
					}}
				>
					{step === 0 && (
						<>
							<div className='mb-4'>
								<div className='font-semibold text-base mb-2'>
									Are you sure you want to report{' '}
									<span className='font-bold text-primary'>
										{stationName}
									</span>
									?
								</div>
								<div className='text-sm text-muted-foreground mb-4'>
									This action will notify our moderation team. Please
									select the main reason for your report below.
								</div>
								<div className='flex flex-col gap-2'>
									<label
										htmlFor='report-reason'
										className='text-sm font-medium text-zinc-700 dark:text-zinc-200'
									>
										Reason for reporting
									</label>
									<SelectDropdown
										value={reason}
										onValueChange={val => setReason(val as string)}
										items={REASONS.map(r => ({ label: r, value: r }))}
										placeholder="Choose a reason for your report"
										className='w-full rounded-xs border border-zinc-300 dark:border-zinc-700 px-2 py-2 bg-white dark:bg-zinc-800 text-sm'
									/>
								</div>
							</div>
							<div className='flex gap-2 mt-4 justify-end'>
								<button
									type='button'
									className='px-4 py-2 font-bold transition-colors border-0 rounded-none bg-zinc-50 text-zinc-700 hover:bg-zinc-100/80 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-700'
									style={{ borderRadius: 0 }}
									onClick={handleReset}
								>
									Cancel
								</button>
								<button
									type='button'
									className='px-4 py-2 font-bold transition-colors border-0 rounded-xs bg-primary text-white hover:bg-primary/80 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-primary/80 cursor-pointer'
									style={{ borderRadius: 0 }}
									disabled={!reason}
									onClick={handleNext}
								>
									Next
								</button>
							</div>
						</>
					)}
					{step === 1 && (
						<>
							<label
								htmlFor='report-details'
								className='text-sm font-medium text-zinc-700 dark:text-zinc-200'
							>
								Additional details (optional)
							</label>
							<textarea
								id='report-details'
								required
								placeholder='Describe the issue or provide more context...'
								value={details}
								onChange={(e) => setDetails(e.target.value)}
								className='rounded-xs border border-zinc-300 dark:border-zinc-700 px-2 py-2 bg-white dark:bg-zinc-800 text-sm min-h-[80px]'
							/>
							<div className='flex gap-2 mt-4 justify-end'>
								<button
									type='button'
									className='px-4 py-2 font-bold transition-colors border-0 rounded-none bg-zinc-50 text-zinc-700 hover:bg-zinc-100/80 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-700'
									style={{ borderRadius: 0 }}
									onClick={handleBack}
								>
									Back
								</button>
								<button
									type='button'
									className='px-4 py-2 font-bold transition-colors border-0 rounded-xs bg-primary text-white hover:bg-primary/80 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-primary/80 cursor-pointer'
									style={{ borderRadius: 0 }}
									disabled={!details}
									onClick={handleNext}
								>
									Next
								</button>
							</div>
						</>
					)}
					{step === 2 && (
						<>
							<div className='mb-4 flex flex-col gap-3'>
								<div className='font-semibold text-xl mb-2 text-primary'>
									Report summary
								</div>
								<div className='flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900 rounded-xs p-6 border border-zinc-200 dark:border-zinc-800'>
									<div className='flex flex-col gap-1'>
										<span className='uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wide'>
											Station
										</span>
										<span className='text-lg font-bold text-primary dark:text-primary'>
											{stationName}
										</span>
									</div>
									<div className='flex flex-col gap-1'>
										<span className='uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wide'>
											Reason
										</span>
										<span className='text-base font-semibold text-zinc-800 dark:text-zinc-100'>
											{reason}
										</span>
									</div>
									<div className='flex flex-col gap-1'>
										<span className='uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wide'>
											Details
										</span>
										{details ? (
											<span className='text-base text-zinc-700 dark:text-zinc-300'>
												{details}
											</span>
										) : (
											<span className='italic text-zinc-400'>
												No additional details provided.
											</span>
										)}
									</div>
									<div className='flex flex-col gap-1'>
										<span className='uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wide'>
											Status
										</span>
										<span className='inline-block bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-xs text-sm text-yellow-800 dark:text-yellow-200 font-semibold'>
											Pending review by moderation team
										</span>
									</div>
								</div>
							</div>
							<div className='flex gap-2 mt-4 justify-end'>
								<button
									type='button'
									className='px-4 py-2 font-bold transition-colors border-0 rounded-none bg-zinc-50 text-zinc-700 hover:bg-zinc-100/80 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-700'
									style={{ borderRadius: 0 }}
									onClick={handleBack}
								>
									Back
								</button>
								<button
									type='submit'
									className='px-4 py-2 font-bold transition-colors shadow border-0 rounded-xs bg-primary text-white hover:bg-primary/80 dark:bg-primary dark:text-white dark:hover:bg-primary/80'
									style={{ borderRadius: 0 }}
									disabled={isPending}
								>
									{isPending ? 'Reporting...' : 'Submit'}
								</button>
							</div>
							{isError && (
								<div className='text-red-500 text-xs mt-1'>
									Error sending report
								</div>
							)}
						</>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};
