Employee Server
---------------

The Employee Server is a standard Pathway server written in 'C'. To build the server, perform these steps, in order:

Transfer the files in this directory to a subvolume on your NonStop system. Use "ascii" transfer mode for all files except those with the ".bin" extension, which should be transferred in "binary" mode. The remainder of the steps should be performed from TACL in the same subvolume.

1. UNPAK EMPPAK ($\*.\*.\*), MYID, VOL $your-vol.your-sv, AUDITED, LISTALL
  * This unpacks the data file that is used to initialize the database
  
2. RUN MAKEDB
  * This creates a DDL dictionary in the current subvolume, loads EMPDDL, and generates EMPH ('C' include file) and EMPFUP (FUP commands). It then creates the Enscribe data file, EMPDATA.
  
3. RUN MAKESVR
  * This compiles the server from the supplied EMPSVRC and EMPH generated above.
  
4. RUN STARTUP
  * This starts a Pathmon, $NWEMP, and configures the EMPSVR program as serverclass EMPLOYEE-SERVER. 
  
5. Add the following DEFINE to your LightWave Server startup and restart LightWave:

   ADD DEFINE =EMPLOYEE-PATHMON, CLASS MAP, FILE $NWEMP
  
  
If you have not already, complete the steps in the LightWave and client folders.
